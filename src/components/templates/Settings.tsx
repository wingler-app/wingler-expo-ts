import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import {
  makeRedirectUri,
  ResponseType,
  useAuthRequest,
} from 'expo-auth-session';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import Button from '../atoms/Button';

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

export default function SettingsTemplate() {
  const [spotifyToken, setSpotifyToken] = useState<String>('nothing');
  // const [value, setValue] = useState<Number>(0);
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: '6960973e424a4929845ac3b16e377c68',
      scopes: [
        'user-read-email',
        'user-library-read',
        'user-read-recently-played',
        'user-top-read',
        'user-read-playback-state',
        'playlist-read-private',
        'playlist-read-collaborative',
        'playlist-modify-public',
        'streaming',
      ],
      // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      redirectUri: makeRedirectUri({
        native: 'com.wingler:/settings',
      }),
    },
    discovery,
  );

  const handleLogout = async () => {
    auth()
      .signOut()
      .then(() => {
        console.log('User signed out!');
        router.push('/');
      });
  };

  useEffect(() => {
    (async () => {
      try {
        let token = await AsyncStorage.getItem('@SpotifyToken');
        token = typeof token === 'string' ? token : 'nothing';
        setSpotifyToken(token);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      (async () => {
        try {
          // eslint-disable-next-line
          let { access_token } = response.params;
          access_token =
            typeof access_token === 'string' ? access_token : 'nothing';
          setSpotifyToken(access_token);
          await AsyncStorage.setItem('@SpotifyToken', access_token);
        } catch (e) {
          console.log(e);
        }
      })();
    }
  }, [response]);

  // const handleMotionPress = () => {
  //   setValue(value === 0 ? 1 : 0);
  // };

  return (
    <View className="flex-1 items-center justify-center bg-primary-dark">
      <Button
        disabled={!request}
        title="Get Spotify Token"
        onPress={() => {
          promptAsync();
        }}
      />
      {/* <Button title="animate" onPress={handleMotionPress} /> */}
      <Button title="Logout" onPress={handleLogout} />

      {/* <View className="relative h-60 w-60 items-center justify-center self-center border-2 border-green-600 ">
        <Motion.View
          animate={{
            scale: value ? 1 : 0,
          }}
          transition={{ type: 'spring' }}
          className="top-0 h-32 w-32 rounded-full bg-teal-600"
        />
        <BlurView
          tint="light"
          intensity={60}
          className="absolute flex h-60 w-60 items-center justify-center self-center border-2 border-black"
        >
          <View className="">
            <Text>logo</Text>
          </View>
        </BlurView>
      </View>
      <Motion.View
        className="h-32 w-32 rounded-full bg-red-600"
        initial={{ y: -50 }}
        animate={{
          x: (value as number) * 100,
          y: 0,
          opacity: value ? 1 : 0.2,
          scale: value ? 1 : 0.5,
        }}
        whileHover={{ scale: 1.2 }}
        whileTap={{ y: 20 }}
        transition={{ type: 'spring' }}
      /> */}

      <Text className="m-4 rounded border-2 border-white p-4 text-white">
        {spotifyToken}
      </Text>
    </View>
  );
}
