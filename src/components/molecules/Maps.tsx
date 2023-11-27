import { GOOGLE_MAPS_API_KEY } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { memo, useEffect, useRef, useState } from 'react';
import { Image, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import type { MapDirectionsResponse } from 'react-native-maps-directions';
import MapViewDirections from 'react-native-maps-directions';

import { useGooglePlaces } from '@/services/GoogleMaps';
import useHistoryStore from '@/store/useHistoryStore';
import type { BotQA } from '@/types';

// @ts-ignore
import * as Colors from '../../styles/colors';
import BubbleText from '../atoms/BubbleText';
import BubbleWrap from '../atoms/BubbleWrap';

type Position = {
  latitude: number;
  longitude: number;
  latitudeDelta?: number;
  longitudeDelta?: number;
};

interface MapsProps {
  id: string;
  content: {
    question: string;
    locations?: Locations;
  };
  type: string;
}

interface MapsBubbleProps {
  locations: Locations;
}

type Locations = {
  start: Position;
  mid: Position;
  answer: Position;
  adress: string;
};

const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@Coords');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    return null;
  }
};

function getMidpoint(pos1: Position, pos2: Position): Position {
  const lat1 = pos1.latitude * (Math.PI / 180); // Convert degrees to radians
  const lon1 = pos1.longitude * (Math.PI / 180);
  const lat2 = pos2.latitude * (Math.PI / 180);
  const lon2 = pos2.longitude * (Math.PI / 180);

  const dLon = lon2 - lon1;

  const Bx = Math.cos(lat2) * Math.cos(dLon);
  const By = Math.cos(lat2) * Math.sin(dLon);

  const midLat = Math.atan2(
    Math.sin(lat1) + Math.sin(lat2),
    Math.sqrt((Math.cos(lat1) + Bx) * (Math.cos(lat1) + Bx) + By * By),
  );
  const midLon = lon1 + Math.atan2(By, Math.cos(lat1) + Bx);

  // Convert back to degrees
  const midLatInDegrees = midLat * (180 / Math.PI);
  const midLonInDegrees = midLon * (180 / Math.PI);

  // Calculate the deltas
  const latDelta = Math.abs(pos1.latitude - pos2.latitude) * 1.2; // 20% padding
  const lonDelta = Math.abs(pos1.longitude - pos2.longitude) * 1.2;
  return {
    latitude: midLatInDegrees,
    longitude: midLonInDegrees,
    latitudeDelta: latDelta,
    longitudeDelta: lonDelta,
  };
}

const imageLogo = require('../../../assets/logo.png');

const MyCustomMarkerView = memo(() => (
  // <View className="z-50">
  // <View className="h-1 w-1 bg-red-500" />
  <Image className="m-0 h-[19] w-[20]" source={imageLogo} />
  /* </View> */
));

const MapsBubble = ({
  locations: { start, mid, answer, adress },
}: MapsBubbleProps) => {
  const mapRef = useRef<MapView | null>(null);
  const [myPos, setMyPos] = useState<Position>({ latitude: 0, longitude: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  console.log('maps render');
  const [img, setImg] = useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        const data = await getData();
        await setMyPos({
          latitude: data.latitude + 0.0003,
          longitude: data.longitude + 0.0005,
        });
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  const takeSnapshot = () => {
    const snapshot = mapRef.current?.takeSnapshot({
      width: 320, // optional, when omitted the view-width is used
      height: 500, // optional, when omitted the view-height is used
      // region: {..},    // iOS only, optional region to render
      format: 'png', // image formats: 'png', 'jpg' (default: 'png')
      result: 'file', // result types: 'file', 'base64' (default: 'file')
    });
    snapshot?.then((uri) => {
      setImg(uri);
    });
  };

  const fitCoords = (coords: Array<Position>) => {
    if (!mapRef.current) return;
    mapRef.current.fitToCoordinates(coords, {
      edgePadding: {
        right: 260 / 20,
        bottom: 260 / 20,
        left: 260 / 20,
        top: 260 / 20,
      },
      animated: false,
    });
    setTimeout(() => {
      takeSnapshot();
    }, 1000);
  };
  const handleOnReady = (result: MapDirectionsResponse): any => {
    // console.log(`Distance: ${result.distance} km`);
    // console.log(`Duration: ${result.duration} min.`);
    fitCoords([...result.coordinates, answer, start, myPos]);
  };

  const handleError = (errorMessage: string): any => {
    console.log('Routes api error: ', errorMessage);
    fitCoords([answer, start]);
  };

  if (loading) return null;
  return (
    <BubbleWrap padding="none" colors={['transparent', 'transparent']}>
      <View className="">
        <Text>{`${mid.latitudeDelta} --- ${mid.longitudeDelta}`}</Text>
        <MapView
          ref={mapRef}
          className="h-[500] w-80 rounded-lg"
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: mid.latitude,
            longitude: mid.longitude,
            latitudeDelta: mid.latitudeDelta || 0.01,
            longitudeDelta: mid.longitudeDelta || 0.01,
          }}
        >
          <Marker coordinate={myPos} title="My current position">
            <MyCustomMarkerView />
          </Marker>
          <Marker coordinate={start} title="My start position" />
          <Marker coordinate={answer} title={adress} />
          <MapViewDirections
            onReady={handleOnReady}
            onError={handleError}
            strokeWidth={6}
            strokeColor={Colors.accent.secondary}
            origin={start}
            destination={adress}
            apikey={GOOGLE_MAPS_API_KEY}
          />
        </MapView>
      </View>
      {img && (
        <Image
          className="h-[500] w-[320]"
          resizeMode="contain"
          source={{ uri: img }}
        />
      )}
    </BubbleWrap>
  );
};

const MapsGenerator = ({ content: { question }, id, type }: MapsProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [myPos, setMyPos] = useState<Position>({ latitude: 0, longitude: 0 });
  const [answerData, answerLoading] = useGooglePlaces(question);
  const { changeById } = useHistoryStore();

  console.log('maps generator render');
  useEffect(() => {
    (async () => {
      try {
        const data = await getData();
        await setMyPos({ latitude: data.latitude, longitude: data.longitude });
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [question]);

  useEffect(() => {
    if (answerData) {
      console.log('got answer', answerData);
      const midpoint = getMidpoint(answerData.places[0].location, myPos);
      const botQA: BotQA = {
        done: true,
        question,
        answer: {
          locations: {
            start: myPos,
            mid: midpoint,
            answer: answerData.places[0].location,
            adress: answerData.places[0].formattedAddress,
          },
          type,
        },
      };
      changeById(id, botQA);
    }
  }, [answerData, changeById, id, myPos, question, type]);

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
  return null;
};

const Maps = ({ content, id, type }: MapsProps) => {
  console.log('maps');
  if (content && content.locations)
    return <MapsBubble locations={content.locations} />;
  return <MapsGenerator content={content} id={id} type={type} />;
};
export default memo(Maps);
