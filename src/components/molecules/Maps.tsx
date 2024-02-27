import { GOOGLE_MAPS_API_KEY } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { memo, useEffect, useRef, useState } from 'react';
import { Image, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import type { MapDirectionsResponse } from 'react-native-maps-directions';
import MapViewDirections from 'react-native-maps-directions';

import { useGooglePlaces } from '@/services/GoogleMaps';
import type { Command } from '@/store/useHistoryStore';
import useHistoryStore from '@/store/useHistoryStore';
import type { BotQA, Position } from '@/types';
import type { PlaceDetails } from '@/types/maps';
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
  activated: boolean;
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
    activated,
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
  const [countDown, setCountDown] = useState<number>(5);
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

  const [details, setDetails] = useState<PlaceDetails | null>(null);

  const { changeById, commands, lastId } = useHistoryStore();
  const router = useRouter();

  const isFirstRender = useRef(true);
  const lastCommandRef = useRef<Command>();
  const lastIdRef = useRef<string | null>();
  const idRef = useRef<string>();
  const handleGoDrivingRef = useRef(() => {});
  const botQARef = useRef<BotQA>();

  botQARef.current = {
    done: true,
    question,
    answer: {
      question,
      activated,
      locations: {
        start,
        mid,
        destinations,
        currentIndex,
      },
      type,
    },
  };

  lastIdRef.current = lastId;
  idRef.current = id;

  const handleGoDriving = () => {
    router.push({
      pathname: '/driving',
      params: {
        start: JSON.stringify(start),
        mid: JSON.stringify(mid),
        answer: JSON.stringify(answer),
        adress,
        details: JSON.stringify(details),
      },
    });
  };

  handleGoDrivingRef.current = handleGoDriving;

  useEffect(() => {
    if (activated || loading) return;
    if (idRef.current !== lastIdRef.current) return;
    if (countDown < 1) {
      const botQA: BotQA = botQARef.current as BotQA;
      botQA.answer.activated = true;
      // setHasActivated(true);
      console.log('botQA', botQA);
      changeById(idRef.current as string, botQA);
      handleGoDrivingRef.current();
      return;
    }
    setTimeout(() => {
      setCountDown(countDown - 1);
    }, 1000);
  }, [activated, countDown, loading, img, changeById]);

  useEffect(() => {
    const getName = async (placeName: string) => {
      try {
        const placeId = placeName.split('/')[1];
        const placeDetailsResponse = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAPS_API_KEY}`,
        );
        const placeDetailsData = await placeDetailsResponse.json();
        setDetails(placeDetailsData.result);
      } catch (e) {
        console.error('Place details API error: ', e);
        setDetails(null); // If an error occurs, return the original place data
      }
    };
    setDetails(null);
    getName(destinations[currentIndex].name);
  }, [currentIndex, destinations]);

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

      const botQA: BotQA = botQARef.current as BotQA;
      botQA.answer.image = uri;
      botQARef.current = botQA;
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
    let index = currentIndex;
    if (value === 'increment') {
      if (index + 1 === destinations.length) {
        index = 0;
      } else {
        index += 1;
      }
    } else if (index - 1 < 0) {
      index = destinations.length - 1;
    } else {
      index -= 1;
    }

    const destination = destinations[index];

    setAdress(destination.formattedAddress);
    setCity(getCity(destination.addressComponents));
    setMid(getMidpoint(destination.location, start));
    setAnswer(destination.location);
    setAdresses(adressParser(destination.formattedAddress));
    setTimeout(() => {
      takeSnapshot();
    }, 1000);
    setCurrentIndex(index);
  };

  const destinationSwitcherRef = useRef(destinationSwitcher);
  destinationSwitcherRef.current = destinationSwitcher;

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (lastIdRef.current !== idRef.current) return;

    const lastCommand = commands[commands.length - 1];
    if (
      lastCommand?.type === 'playback' &&
      lastCommand !== lastCommandRef.current
    ) {
      lastCommandRef.current = lastCommand;
      switch (lastCommand.command) {
        case 'next':
          destinationSwitcherRef.current('increment')();
          break;
        case 'previous':
          destinationSwitcherRef.current('decrement')();
          break;
        default:
          break;
      }
    }
  }, [commands]);

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
          {details ? details.name : '...'}
        </H>
        <P
          size="sm"
          dark
          numberOfLines={1}
          adjustsFontSizeToFit
          className="max-w-[300] self-center"
        >
          {adresses[0]}
        </P>
        <P
          size="xs"
          dark
          numberOfLines={1}
          adjustsFontSizeToFit
          className="max-w-[300] self-center opacity-50"
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
          title={activated ? 'Directions' : `${countDown} Directions`}
          onPress={handleGoDriving}
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
      const botQA: BotQA = {
        done: true,
        question,
        answer: {
          question,
          activated: false,
          locations: {
            start: myPos,
            destinations: answerData.places,
            destinationIndex: 0,
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
