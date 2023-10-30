import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  AuthRequest,
  AuthRequestPromptOptions,
  AuthSessionResult,
} from 'expo-auth-session';
import {
  makeRedirectUri,
  ResponseType,
  useAuthRequest,
} from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { getColors } from 'react-native-image-colors';
import type { AndroidImageColors } from 'react-native-image-colors/build/types';

const API: string = 'https://api.spotify.com/v1/';

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

const scopes: string[] = [
  'user-read-email',
  'user-library-read',
  'user-read-recently-played',
  'user-top-read',
  'user-read-playback-state',
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'streaming',
];

type DeviceType = {
  id: number;
  name: string;
};

type Track = {
  uri: string;
  name: string;
  albumCover: string;
  artist: {
    name: string;
    id: string;
  };
  colors: string[];
};

interface ArtistType {
  uri: string;
  avatar: string;
}

type GenreProps = string;
type ArtistProps = string;

interface SpotifyResponse {
  loading: boolean;
  error: any;
}

interface GenreResponse extends SpotifyResponse {
  answer: Track;
}

interface ArtistResponse extends SpotifyResponse {
  answer: ArtistType;
}

const useGenre = (genre: GenreProps): GenreResponse => {
  const [loading, setLoading] = useState<boolean>(true);
  const [answer, setAnswer] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const abortController = new AbortController();

    (async () => {
      const accessToken = await AsyncStorage.getItem('@SpotifyToken');
      try {
        const response = await fetch(
          `${API}search?q=genre%3A${genre}&type=track`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        const data = await response.json();
        const { average, darkMuted } = (await getColors(
          data.tracks.items[0].album.images[0].url,
        )) as AndroidImageColors;

        await setAnswer({
          uri: data.tracks.items[0].uri,
          name: data.tracks.items[0].name,
          albumCover: data.tracks.items[0].album.images[0].url,
          artist: {
            name: data.tracks.items[0].artists[0].name,
            id: data.tracks.items[0].artists[0].id,
          },
          colors: [average, darkMuted],
        });
        setLoading(false);
      } catch (e) {
        setError(e);
      }
    })();

    return () => abortController.abort();
  }, [genre]);

  return { answer, loading, error };
};

const useArtist = (id: ArtistProps): ArtistResponse => {
  const [loading, setLoading] = useState<boolean>(true);
  const [answer, setAnswer] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const accessToken = await AsyncStorage.getItem('@SpotifyToken');

      try {
        const response = await fetch(`${API}artists/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        await setAnswer({
          uri: data.uri,
          avatar: data.images[0].url,
        });
        setLoading(false);
      } catch (e) {
        console.log(e);
        setError(e);
      }
    })();
  }, [id]);

  return { answer, loading, error };
};

const useDevice = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [devices, setDevices] = useState<DeviceType[]>([]);
  const [error, setError] = useState<any>(null);
  const [device, setDevice] = useState<DeviceType | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const d = await AsyncStorage.getItem('@SpotifyDevice');
        if (d) setDevice(JSON.parse(d));
      } catch (e) {
        console.log(e);
      }
    })();
  }, [device]);

  useEffect(() => {
    (async () => {
      try {
        const accessToken = await AsyncStorage.getItem('@SpotifyToken');
        const response = await fetch(
          'https://api.spotify.com/v1/me/player/devices',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        const data = await response.json();
        //  {"error": {"message": "The access token expired", "status": 401}}gg
        if (data.error) throw new Error(data.error.message);
        if (data.devices.length === 0) throw new Error('No devices found');
        await setDevices(data.devices);
        setLoading(false);
      } catch (e) {
        setError(e);
      }
    })();
  }, []);

  return { device, devices, loading, error };
};

const play = async (uri: string) => {
  if (!uri) return;

  const body = JSON.stringify({
    uris: [uri],
    offset: {
      position: 0,
    },
    position_ms: 0,
  });

  try {
    const accessToken = await AsyncStorage.getItem('@SpotifyToken');
    let device: DeviceType = { id: 0, name: '' };
    const d = await AsyncStorage.getItem('@SpotifyDevice');
    if (d) device = JSON.parse(d);
    const url = `${API}me/player/play?device_id=${device.id}`;
    console.log(url);
    await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body,
    });
  } catch (e) {
    console.error(e);
  }
};

const useToken = (): [
  AuthRequest | null,
  AuthSessionResult | null,
  (options?: AuthRequestPromptOptions) => Promise<AuthSessionResult>,
  string,
] => {
  WebBrowser.maybeCompleteAuthSession();
  const [token, setToken] = useState<string>('nothing');
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: '6960973e424a4929845ac3b16e377c68',
      scopes,
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
      const accessToken = await AsyncStorage.getItem('@SpotifyToken');
      if (accessToken) setToken(accessToken);
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
          await setToken(access_token);
          await AsyncStorage.setItem('@SpotifyToken', access_token);
        } catch (e) {
          console.log(e);
        }
      })();
    }
  }, [response]);

  return [request, response, promptAsync, token];
};

export { play, useArtist, useDevice, useGenre, useToken };
