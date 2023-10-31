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
const clientId = '6960973e424a4929845ac3b16e377c68';
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

interface SpotifyAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  refresh_token: string;
}

interface SpotifyParamsRecord extends SpotifyAuthResponse {
  timestamp: number;
}

type GenreProps = string;
type ArtistProps = string;

type PlaybackPlay = (url: string) => Promise<void>;
type PlaybackPause = () => Promise<void>;

interface SpotifyResponse {
  loading: boolean;
  error: FetchError | null;
}

interface GenreResponse extends SpotifyResponse {
  answer: Track;
}

interface ArtistResponse extends SpotifyResponse {
  answer: ArtistType;
}

const useToken = (): [
  SpotifyAuthResponse | null,
  AuthRequest | null,
  (options?: AuthRequestPromptOptions) => Promise<AuthSessionResult>,
  AuthSessionResult | null,
] => {
  WebBrowser.maybeCompleteAuthSession();
  const [params, setParams] = useState<any | null>(null);
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId,
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
      const paramsString = await AsyncStorage.getItem('@SpotifyParams');
      if (paramsString) {
        const paramsData: SpotifyParamsRecord = JSON.parse(paramsString);
        const expirationTime =
          paramsData.expires_in * 1000 + paramsData.timestamp;
        if (expirationTime > Date.now()) {
          setParams(paramsData);
        } else {
          promptAsync();
        }
      }
    })();
  }, [promptAsync]);

  useEffect(() => {
    if (response?.type === 'success') {
      (async () => {
        try {
          const newParams = {
            ...response.params,
            timestamp: Date.now(),
          };
          setParams(newParams);
          await AsyncStorage.setItem(
            '@SpotifyParams',
            JSON.stringify(newParams),
          );
        } catch (e) {
          console.log(e);
        }
      })();
    }
  }, [response]);

  return [params, request, promptAsync, response];
};

const usePlayback = (): [PlaybackPlay, PlaybackPause] => {
  const [params] = useToken();

  const play = async (uri: string) => {
    if (uri && params) {
      const body = JSON.stringify({
        uris: [uri],
        offset: {
          position: 0,
        },
        position_ms: 0,
      });

      try {
        let device: DeviceType = { id: 0, name: '' };
        const data = await AsyncStorage.getItem('@SpotifyDevice');
        if (data) device = JSON.parse(data);
        const url = `${API}me/player/play?device_id=${device.id}`;
        console.log(url);
        await fetch(url, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${params.access_token}`,
            'Content-Type': 'application/json',
          },
          body,
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const pause = async () => {
    if (params) {
      const url = `${API}me/player/pause`;
      await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${params.access_token}`,
          'Content-Type': 'application/json',
        },
      });
    }
  };

  return [play, pause];
};

const useGenre = (genre: GenreProps): GenreResponse => {
  const [loading, setLoading] = useState<boolean>(true);
  const [answer, setAnswer] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [params] = useToken();

  useEffect(() => {
    const abortController = new AbortController();
    if (params) {
      (async () => {
        try {
          const response = await fetch(
            `${API}search?q=genre%3A${genre}&type=track`,
            {
              headers: {
                Authorization: `Bearer ${params.access_token}`,
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
    }
    return () => abortController.abort();
  }, [genre, params]);

  return { answer, loading, error };
};

const useArtist = (id: ArtistProps): ArtistResponse => {
  const [loading, setLoading] = useState<boolean>(true);
  const [answer, setAnswer] = useState<any>(null);
  const [error, setError] = useState<FetchError | null>(null);
  const [params] = useToken();

  useEffect(() => {
    if (params) {
      (async () => {
        try {
          const response = await fetch(`${API}artists/${id}`, {
            headers: {
              Authorization: `Bearer ${params.access_token}`,
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
          setError(e as FetchError);
        }
      })();
    }
  }, [id, params]);

  return { answer, loading, error };
};

type FetchError = {
  status: number;
  message: string;
};

const useDevice = (): [
  DeviceType | null,
  DeviceType[],
  boolean,
  FetchError | null,
] => {
  const [loading, setLoading] = useState<boolean>(true);
  const [device, setDevice] = useState<DeviceType | null>(null);
  const [devices, setDevices] = useState<DeviceType[]>([]);
  const [error, setError] = useState<FetchError | null>(null);
  const [params] = useToken();

  useEffect(() => {
    (async () => {
      try {
        const data = await AsyncStorage.getItem('@SpotifyDevice');
        if (data) setDevice(JSON.parse(data));
      } catch (e) {
        console.log(e);
      }
    })();
  }, [device]);

  useEffect(() => {
    if (params) {
      (async () => {
        try {
          const response = await fetch(
            'https://api.spotify.com/v1/me/player/devices',
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${params.access_token}`,
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
          setError(e as FetchError);
          setLoading(false);
        }
      })();
    }
  }, [params]);

  return [device, devices, loading, error];
};

export { useArtist, useDevice, useGenre, usePlayback, useToken };
