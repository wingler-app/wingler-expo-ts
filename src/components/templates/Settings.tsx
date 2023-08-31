import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

export default function SettingsTemplate() {
  const [spotifyToken, setSpotifyToken] = useState<String>('nothing');
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: '6960973e424a4929845ac3b16e377c68',
      scopes: [
        'user-read-email',
        'user-library-read',
        'user-read-recently-played',
        'user-top-read',
        'playlist-read-private',
        'playlist-read-collaborative',
        'playlist-modify-public',
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
          let { code } = response.params;
          code = typeof code === 'string' ? code : 'nothing';
          setSpotifyToken(code);
          await AsyncStorage.setItem('@SpotifyToken', code);
        } catch (e) {
          console.log(e);
        }
      })();
    }
  }, [response]);

  return (
    <View className="flex-1 items-center justify-center">
      <Button
        disabled={!request}
        title="Login"
        onPress={() => {
          promptAsync();
        }}
      />
      <Text className="m-2 text-red-600">{spotifyToken}</Text>
    </View>
  );
}
