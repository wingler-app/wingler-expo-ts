import { GOOGLE_MAPS_API_KEY } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { memo, useEffect, useRef, useState } from 'react';
import { Image, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import type { MapDirectionsResponse } from 'react-native-maps-directions';
import MapViewDirections from 'react-native-maps-directions';

import { useGooglePlaces } from '@/services/GoogleMaps';
import useHistoryStore from '@/store/useHistoryStore';
import type { BotQA, Position } from '@/types';
import { adressParser, getCity, getMidpoint } from '@/utils/maps';

// @ts-ignore
import * as Colors from '../../styles/colors';
import BubbleText from '../atoms/BubbleText';
import BubbleWrap from '../atoms/BubbleWrap';
import Button from '../atoms/Button';
import { H, P } from '../atoms/Words';

export type Locations = {
  start: Position;
  mid: Position;
  destinations: any[];
  destinationIndex?: number;
  answer?: Position;
};

type Content = {
  question: string;
  locations?: Locations;
  image?: string;
};

type BaseProps = {
  id: string;
  type: string;
  content: Content;
};

interface MapsProps extends BaseProps {
  visible?: boolean;
  locations?: Locations;
}

interface MapsGeneratorProps extends BaseProps {}

interface MapsBubbleProps extends BaseProps {
  visible?: boolean;
  content: Content & { locations: Locations }; // locations is always defined
}

export const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@Coords');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    return null;
  }
};

const imageLogo = require('../../../assets/logo.png');

export const MyCustomMarkerView = memo(() => (
  <Image className="m-0 h-[19] w-[20]" source={imageLogo} />
));

const MapsBubble = ({
  content: {
    locations: { start, destinations, destinationIndex },
    image,
    question,
  },
  visible,
  type,
  id,
}: MapsBubbleProps) => {
  const mapRef = useRef<MapView | null>(null);
  const [myPos, setMyPos] = useState<Position>({ latitude: 0, longitude: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const [img, setImg] = useState<string | null>(image || null);
  const [currentIndex, setCurrentIndex] = useState<number>(
    destinationIndex || 0,
  );

  const [adress, setAdress] = useState<string>(
    destinations[destinationIndex || 0].formattedAddress,
  );
  const [city, setCity] = useState<string>(
    getCity(destinations[destinationIndex || 0].addressComponents),
  );
  const [mid, setMid] = useState<Position>(
    getMidpoint(destinations[destinationIndex || 0].location, start),
  );
  const [answer, setAnswer] = useState<Position>(
    destinations[destinationIndex || 0].location,
  );
  const [adresses, setAdresses] = useState<string[]>(
    adressParser(destinations[destinationIndex || 0].formattedAddress),
  );
  // const { clearHistory } = useHistoryStore();
  // clearHistory();
  // const answer = destination.location;
  // const mid = getMidpoint(answer, start);
  // const city = getCity(destination.addressComponents);
  // const adress = destination.formattedAddress;

  const { changeById } = useHistoryStore();
  // const adresses = adressParser(adress);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const data = await getData();
        await setMyPos({
          latitude: data.latitude,
          longitude: data.longitude,
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

      const botQA: BotQA = {
        done: true,
        question,
        answer: {
          question,
          image: uri,
          locations: {
            start,
            mid,
            destinations,
            currentIndex,
          },
          type,
        },
      };
      changeById(id, botQA);
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

    if (!img) {
      setTimeout(() => {
        takeSnapshot();
      }, 1000);
    }
  };

  const handleOnReady = (result: MapDirectionsResponse): any => {
    // console.log(`Distance: ${result.distance} km`);
    // console.log(`Duration: ${result.duration} min.`);
    fitCoords([...result.coordinates, answer, start]);
  };

  const handleError = (errorMessage: string): any => {
    console.log('Routes api error: ', errorMessage);
    fitCoords([answer, start]);
  };

  const destinationSwitcher = (value: 'increment' | 'decrement') => () => {
    console.log('Switching destination');
    if (value === 'increment') {
      if (currentIndex + 1 === destinations.length) {
        setCurrentIndex(0);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    } else if (currentIndex - 1 < 0) {
      setCurrentIndex(destinations.length - 1);
    } else {
      setCurrentIndex(currentIndex - 1);
    }
    const destination = destinations[currentIndex];
    setAdress(destination.formattedAddress);
    setCity(getCity(destination.addressComponents));
    setMid(getMidpoint(destination.location, start));
    setAnswer(destination.location);
    setAdresses(adressParser(destination.formattedAddress));
    setTimeout(() => {
      takeSnapshot();
    }, 1000);
  };

  if (loading) return null;

  return (
    <BubbleWrap padding="none" type="map">
      {img && !visible ? (
        <Image
          className="h-[500] w-[320]"
          resizeMode="contain"
          source={{ uri: img }}
        />
      ) : (
        <MapView
          ref={mapRef}
          pitchEnabled
          className="h-[500] w-80 rounded-lg"
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: mid.latitude,
            longitude: mid.longitude,
            latitudeDelta: mid.latitudeDelta || 0.01,
            longitudeDelta: mid.longitudeDelta || 0.01,
          }}
        >
          <Marker coordinate={start} title="My start position" />
          <Marker coordinate={answer} title={adress} />
          <Marker coordinate={myPos} title="My current position">
            <MyCustomMarkerView />
          </Marker>
          <MapViewDirections
            onReady={handleOnReady}
            onError={handleError}
            strokeWidth={6}
            strokeColor={Colors.accent.secondary}
            origin={start}
            destination={adress}
            mode="DRIVING"
            apikey={GOOGLE_MAPS_API_KEY}
          />
        </MapView>
      )}
      <View className="pb-4 pt-3">
        <H
          size="2xl"
          numberOfLines={1}
          adjustsFontSizeToFit
          className="max-w-[300] self-center"
        >
          {adresses[0]}
        </H>
        <P
          dark
          numberOfLines={1}
          adjustsFontSizeToFit
          className="max-w-[300] self-center"
        >
          {city}
        </P>
      </View>
      <View className="flex flex-row justify-center gap-x-4">
        {destinations.length > 1 && (
          <Button
            type="minimal"
            icon="md-chevron-back"
            onPress={destinationSwitcher('decrement')}
          />
        )}
        <Button
          iconAfter
          icon="car"
          title="Directions"
          onPress={() =>
            router.push({
              pathname: '/driving',
              params: {
                start: JSON.stringify(start),
                mid: JSON.stringify(mid),
                answer: JSON.stringify(answer),
                adress,
              },
            })
          }
        />
        {destinations.length > 1 && (
          <Button
            type="minimal"
            icon="md-chevron-forward"
            onPress={destinationSwitcher('increment')}
          />
        )}
      </View>
      {destinations.length > 1 && (
        <P dark size="xs" className="relative -top-3">
          {currentIndex + 1} of {destinations.length}
        </P>
      )}
    </BubbleWrap>
  );
};

const MapsGenerator = ({
  content: { question },
  id,
  type,
}: MapsGeneratorProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [myPos, setMyPos] = useState<Position>({ latitude: 0, longitude: 0 });
  const [answerData, answerLoading, answerError] = useGooglePlaces(question);
  const { changeById } = useHistoryStore();

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
    if (answerData && answerData?.places !== undefined && !answerError) {
      console.log('Got an answer: ', answerData.places[0].addressComponents);
      // const midpoint = getMidpoint(answerData.places[0].location, myPos);
      // const city = getCity(answerData.places[0].addressComponents);
      const botQA: BotQA = {
        done: true,
        question,
        answer: {
          question,
          locations: {
            start: myPos,
            destinations: answerData.places,
            destinationIndex: 0,
            // mid: midpoint,
            // answer: answerData.places[0].location,
            //
            // city,
          },
          type,
        },
      };
      changeById(id, botQA);
    }
  }, [answerData, answerError, changeById, id, myPos, question, type]);

  if (loading || answerLoading)
    return (
      <BubbleWrap type="answer">
        <BubbleText>Let me check my maps...</BubbleText>
      </BubbleWrap>
    );

  if (answerError)
    return (
      <BubbleWrap type="answer">
        <BubbleText>
          Something didn&apos;t sit right.. {answerError.message}
        </BubbleText>
      </BubbleWrap>
    );

  if (answerData?.places === undefined)
    return (
      <BubbleWrap type="answer">
        <BubbleText>Sorry, never heard of that place...</BubbleText>
      </BubbleWrap>
    );

  return null;
};

const Maps = ({ content, id, type, visible }: MapsProps) => {
  if (content && content.locations)
    return (
      <MapsBubble
        content={content as MapsBubbleProps['content']}
        visible={!!visible}
        type={type}
        id={id}
      />
    );
  return <MapsGenerator content={content} id={id} type={type} />;
};

export default memo(Maps);
