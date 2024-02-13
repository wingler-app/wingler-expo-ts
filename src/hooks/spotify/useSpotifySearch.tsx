import { useEffect, useState } from 'react';
import { getColors } from 'react-native-image-colors';
import type { AndroidImageColors } from 'react-native-image-colors/build/types';

import useToken from '@/hooks/spotify/useToken';
import type { SpotifyResponse, Track } from '@/types/spotify';
import { spotifyFetch } from '@/utils/spotify';

type GenreProps = {
  genre: string;
  type?: string;
};
interface GenreResponse extends SpotifyResponse {
  answer: Track;
}
type SearchMappingType = {
  [key: string]: string;
};

const searchMapping: SearchMappingType = {
  music: 'search?q=genre%3A',
  musicartist: 'search?q=artist%3A',
  musicalbum: 'search?q=album%3A',
  musicsong: 'search?q=',
  musicplaylist: 'search?q=',
  musicuser: 'search?q=',
};
const useSpotifySearch = ({ genre, type }: GenreProps): GenreResponse => {
  const [loading, setLoading] = useState<boolean>(true);
  const [answer, setAnswer] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [params] = useToken();

  useEffect(() => {
    const searchString = searchMapping[type || 'music'];
    const abortController = new AbortController();
    if (params) {
      (async () => {
        try {
          const data = await spotifyFetch(
            `${searchString}${genre}&type=track`,
            params.accessToken,
          );

          const { average, darkMuted } = (await getColors(
            data.tracks.items[0].album.images[0].url,
          )) as AndroidImageColors;

          const uris = data.tracks.items.map((track: any) => track.uri);

          await setAnswer({
            uris,
            name: data.tracks.items[0].name,
            albumCover: data.tracks.items[0].album.images[0].url,
            artist: {
              name: data.tracks.items[0].artists[0].name,
              id: data.tracks.items[0].artists[0].id,
            },
            colors: [average, darkMuted],
          });
        } catch (e) {
          setError(e);
        } finally {
          setLoading(false);
        }
      })();
    }
    return () => abortController.abort();
  }, [genre, type, params]);

  return { answer, loading, error };
};

export default useSpotifySearch;
