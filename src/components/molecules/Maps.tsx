import { GOOGLE_MAPS_API_KEY } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import type { MapDirectionsResponse } from 'react-native-maps-directions';
import MapViewDirections from 'react-native-maps-directions';

import { useGooglePlaces } from '@/services/GoogleMaps';

// @ts-ignore
import * as Colors from '../../styles/colors';
import BubbleText from '../atoms/BubbleText';
import BubbleWrap from '../atoms/BubbleWrap';

type Position = {
  latitude: number;
  longitude: number;
};

interface MapsProps {
  content: {
    question: string;
  };
}

const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@Coords');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    return null;
  }
};

const Maps = ({ content: { question } }: MapsProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [myPos, setMyPos] = useState<Position>({ latitude: 0, longitude: 0 });
  const [answerData, answerLoading] = useGooglePlaces(question);

  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getData();
        console.log(data);
        await setMyPos({ latitude: data.latitude, longitude: data.longitude });
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [question]);

  const fitCoords = (coords: Array<Position>) => {
    if (!mapRef.current) return;
    mapRef.current.fitToCoordinates(coords, {
      edgePadding: {
        right: 260 / 20,
        bottom: 260 / 20,
        left: 260 / 20,
        top: 260 / 20,
      },
    });
  };

  if (loading || answerLoading)
    return (
      <BubbleWrap type="answer">
        <BubbleText>Connecting to SkyNet... </BubbleText>
      </BubbleWrap>
    );

  if (answerData?.places === undefined)
    return (
      <BubbleWrap type="answer">
        <BubbleText>Sorry, theres no place like that...</BubbleText>
      </BubbleWrap>
    );

  const answer = answerData.places[0].location;
  const adress = answerData.places[0].formattedAddress;

  const handleOnReady = (result: MapDirectionsResponse): any => {
    // console.log(`Distance: ${result.distance} km`);
    // console.log(`Duration: ${result.duration} min.`);
    fitCoords([...result.coordinates, answer, myPos]);
  };

  const handleError = (errorMessage: string): any => {
    console.log('Routes api error: ', errorMessage);
    fitCoords([answer, myPos]);
  };

  return (
    <BubbleWrap padding="none" colors={['transparent', 'transparent']}>
      <View className="">
        <MapView
          ref={mapRef}
          className="h-[500] w-80 rounded-lg"
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: myPos.latitude,
            longitude: myPos.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker coordinate={myPos} title="Your current position" />
          <Marker coordinate={answer} title={adress} />
          <MapViewDirections
            onReady={handleOnReady}
            onError={handleError}
            strokeWidth={6}
            strokeColor={Colors.accent.secondary}
            origin={myPos}
            destination={adress}
            apikey={GOOGLE_MAPS_API_KEY}
          />
        </MapView>
      </View>
    </BubbleWrap>
  );
};

export default Maps;
