import { GOOGLE_MAPS_API_KEY } from '@env';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import type { MapDirectionsResponse } from 'react-native-maps-directions';
import MapViewDirections from 'react-native-maps-directions';

import useMagnetometer from '@/hooks/useMagnetometer';
import useUserStore from '@/store/useUserStore';
import type { Position } from '@/types';

// @ts-ignore
import * as Colors from '../../styles/colors';
import FancyValue from '../molecules/FancyValue';
import { getData, MyCustomMarkerView } from '../molecules/Maps';
import SliderMenu from '../organisms/SliderMenu';

const adressParser = (input: string): string[] => {
  const splitInput = input.split(',', 2);
  splitInput[1] = splitInput[1]?.replace(', Sweden', '') || '';
  return splitInput;
};

function getDistance(pointA: Position, pointB: Position) {
  const R = 6371e3; // Earth's radius in meters
  const lat1 = (pointA.latitude * Math.PI) / 180; // Convert degrees to radians
  const lat2 = (pointB.latitude * Math.PI) / 180;
  const deltaLat = ((pointB.latitude - pointA.latitude) * Math.PI) / 180;
  const deltaLon = ((pointB.longitude - pointA.longitude) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in meters
  return distance;
}

const DrivingTemplate = () => {
  const [myPos, setMyPos] = useState<Position>({ latitude: 0, longitude: 0 });
  const [distance, setDistance] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const { magnetometer, degree, direction } = useMagnetometer();

  const { coords } = useUserStore();

  const params = useLocalSearchParams<{
    start: string;
    mid: string;
    answer: string;
    adress: string;
  }>();

  const start = JSON.parse(params.start || '');
  const mid = JSON.parse(params.mid || '');
  const answer = JSON.parse(params.answer || '');
  const adress = adressParser(params.adress || '');
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
          <Text className="text-center text-4xl text-accent-secondary">
            {adress[0]}
          </Text>
          <Text className="mb-10 text-center text-xl text-white">
            {adress[1]}
          </Text>

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
