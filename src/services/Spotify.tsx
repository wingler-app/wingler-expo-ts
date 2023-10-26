import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { getColors } from 'react-native-image-colors';
import type { AndroidImageColors } from 'react-native-image-colors/build/types';

const API: string = 'https://api.spotify.com/v1/';

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
  const [answer, setAnswer] = useState<any>(null);
  const [error, setError] = useState<any>(null);

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
        await setAnswer(data);
        setLoading(false);
      } catch (e) {
        setError(e);
      }
    })();
  }, []);

  return { answer, loading, error };
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
    await fetch(
      'https://api.spotify.com/v1/me/player/play?device_id=74ae9cb15eda31ca459bf6e31757557861352fd1',
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body,
      },
    );
  } catch (e) {
    console.error(e);
  }
};

export { play, useArtist, useDevice, useGenre };
