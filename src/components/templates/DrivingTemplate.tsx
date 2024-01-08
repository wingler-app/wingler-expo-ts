import { GOOGLE_MAPS_API_KEY } from '@env';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import type { MapMarker } from 'react-native-maps';
import MapView, {
  Marker,
  MarkerAnimated,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import type { MapDirectionsResponse } from 'react-native-maps-directions';
import MapViewDirections from 'react-native-maps-directions';

import useMagnetometer from '@/hooks/useMagnetometer';
import useUserStore from '@/store/useUserStore';
import type { Position } from '@/types';
import type { PlaceDetails } from '@/types/maps';
import { adressParser, getDistance } from '@/utils/maps';

// @ts-ignore
import * as Colors from '../../styles/colors';
import Button from '../atoms/Button';
import { H, P } from '../atoms/Words';
import FancyValue from '../molecules/FancyValue';
import type { Locations } from '../molecules/Maps';
import { getData, MyCustomMarkerView } from '../molecules/Maps';
import Details from '../organisms/Details';
import WingModal from '../organisms/Modal';
import SliderMenu from '../organisms/SliderMenu';

type Params = {
  start: string;
  mid: string;
  answer: string;
  adress: string;
  details: string;
};

const DrivingTemplate = () => {
  const [myPos, setMyPos] = useState<Position>({ latitude: 0, longitude: 0 });
  const [mapPos, setMapPos] = useState<Position>({ latitude: 0, longitude: 0 });
  const [distance, setDistance] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const { magnetometer, degree, direction } = useMagnetometer();

  const { coords } = useUserStore();

  const params = useLocalSearchParams<Params>();

  const start = JSON.parse(params.start || '') as Locations['start'];
  const mid = JSON.parse(params.mid || '') as Locations['mid'];
  const answer = JSON.parse(params.answer || '') as Locations['answer'];
  const adress = adressParser(params.adress || '') as string[];
  const details = JSON.parse(params.details || '') as PlaceDetails;

  const mapRef = useRef<MapView | null>(null);
  const myPosRef = useRef<MapMarker | null>(null);

  useEffect(() => {
    if (coords) {
      if (getDistance(mapPos, coords) > 10) {
        setMapPos({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
      }
      if (getDistance(myPos, coords) > 5) {
        setMyPos({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
        if (myPosRef.current)
          myPosRef.current.animateMarkerToCoordinate(
            {
              latitude: coords.latitude,
              longitude: coords.longitude,
            },
            500,
          );
      }
    }
  }, [coords, myPos, mapPos]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getData();
        setMapPos({
          latitude: data.latitude,
          longitude: data.longitude,
        });
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.animateCamera(
        {
          center: {
            latitude: mapPos.latitude,
            longitude: mapPos.longitude,
          },
          pitch: 45,
          ...(autoRotate && { heading: degree }),
          // altitude: 10,
          // zoom: 19,
        },
        { duration: 500 },
      );
    }
  }, [mapPos, degree, autoRotate]);

  const handleOnReady = (result: MapDirectionsResponse): any => {
    setDistance(result.distance);
    setDuration(result.duration);
  };

  const handleError = (errorMessage: string): any => {
    console.log('Routes api error: ', errorMessage);
  };

  if (
    !start ||
    !mid ||
    !answer ||
    !adress ||
    !magnetometer ||
    myPos.latitude === 0
  )
    return null;

  return (
    <>
      <MapView
        ref={mapRef}
        pitchEnabled
        className="h-full w-full rounded-lg"
        provider={PROVIDER_GOOGLE}
        initialCamera={{
          center: {
            latitude: mapPos.latitude,
            longitude: mapPos.longitude,
          },
          pitch: 45,
          heading: degree,
          altitude: 10,
          zoom: 19,
        }}
      >
        <Marker coordinate={start} title="My start position" />
        <Marker coordinate={answer} title={adress[0]} />
        <MarkerAnimated
          ref={myPosRef}
          coordinate={myPos}
          title="My current position"
        >
          <MyCustomMarkerView />
        </MarkerAnimated>
        <MapViewDirections
          onReady={handleOnReady}
          onError={handleError}
          strokeWidth={6}
          strokeColor={Colors.accent.secondary}
          origin={myPos}
          destination={answer}
          mode="DRIVING"
          apikey={GOOGLE_MAPS_API_KEY}
        />
      </MapView>
      <SliderMenu backButton="Back to Chat">
        <View className="py-6">
          <H size="2xl" className="mb-2">
            {details.name}
          </H>
          <P dark className="">
            {adress[0]}
          </P>
          <P dark size="sm" className="mb-10 opacity-50">
            {adress[1]}
          </P>
          <Button
            icon="information-circle"
            onPress={() => setShowDetails(true)}
            title="Details"
            iconAfter
          />
          <WingModal
            title="Details"
            visible={showDetails}
            onClose={() => setShowDetails(false)}
          >
            <Details details={details} />
          </WingModal>

          <View className="mb-10 mt-6 flex flex-row justify-center gap-x-8">
            <FancyValue
              title="Distance"
              value={distance.toFixed(1)}
              type="distance"
            />
            <FancyValue
              title="Direction"
              value={`${degree.toFixed(0)}° ${direction}`}
            />
            <FancyValue
              title="Duration"
              value={duration.toFixed(1)}
              type="duration"
            />
          </View>
          <View className="">
            <Button
              icon="compass-outline"
              type="slider"
              title="Auto Rotate"
              active={autoRotate}
              onPress={() => setAutoRotate((prev) => !prev)}
            />
          </View>
        </View>
      </SliderMenu>
    </>
  );
};

export default DrivingTemplate;
