import { GOOGLE_MAPS_API_KEY } from '@env';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import type { MapDirectionsResponse } from 'react-native-maps-directions';
import MapViewDirections from 'react-native-maps-directions';

import useMagnetometer from '@/hooks/useMagnetometer';
import useUserStore from '@/store/useUserStore';
import type { Position } from '@/types';
import { adressParser, getDistance } from '@/utils/maps';

// @ts-ignore
import * as Colors from '../../styles/colors';
import { H1, P } from '../atoms/Words';
import FancyValue from '../molecules/FancyValue';
import type { Locations } from '../molecules/Maps';
import { getData, MyCustomMarkerView } from '../molecules/Maps';
import SliderMenu from '../organisms/SliderMenu';

type Params = {
  start: string;
  mid: string;
  answer: string;
  adress: string;
};

const DrivingTemplate = () => {
  const [myPos, setMyPos] = useState<Position>({ latitude: 0, longitude: 0 });
  const [distance, setDistance] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const { magnetometer, degree, direction } = useMagnetometer();

  const { coords } = useUserStore();

  const params = useLocalSearchParams<Params>();

  const start = JSON.parse(params.start || '') as Locations['start'];
  const mid = JSON.parse(params.mid || '') as Locations['mid'];
  const answer = JSON.parse(params.answer || '') as Locations['answer'];
  const adress = adressParser(params.adress || '') as string[];
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    console.log('useEffect');
    if (coords) {
      if (getDistance(myPos, coords) > 5) {
        setMyPos({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
      }
    }
  }, [coords, myPos]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getData();
        setMyPos({
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
            latitude: myPos.latitude,
            longitude: myPos.longitude,
          },
          pitch: 45,
          heading: degree,
          // altitude: 10,
          // zoom: 19,
        },
        { duration: 500 },
      );
    }
  }, [myPos, degree]);

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
            latitude: myPos.latitude,
            longitude: myPos.longitude,
          },
          pitch: 45,
          heading: degree,
          altitude: 10,
          zoom: 19,
        }}
      >
        <Marker coordinate={start} title="My start position" />
        <Marker coordinate={answer} title={adress[0]} />
        <Marker coordinate={myPos} title="My current position">
          <MyCustomMarkerView />
        </Marker>
        <MapViewDirections
          onReady={handleOnReady}
          onError={handleError}
          strokeWidth={6}
          strokeColor={Colors.accent.secondary}
          origin={start}
          destination={answer}
          mode="DRIVING"
          apikey={GOOGLE_MAPS_API_KEY}
        />
      </MapView>
      <SliderMenu backButton="Back to Chat">
        <View className="py-6">
          <H1 dark>{adress[0]}</H1>
          <P dark className="mb-10">
            {adress[1]}
          </P>

          <View className="flex flex-row justify-center gap-8">
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
        </View>
      </SliderMenu>
    </>
  );
};

export default DrivingTemplate;
