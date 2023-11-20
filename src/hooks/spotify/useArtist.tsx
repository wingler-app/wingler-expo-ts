import { useEffect, useState } from 'react';

import type { ArtistProps, ArtistResponse, FetchError } from '@/types/spotify';
import { spotifyFetch } from '@/utils/spotify';

import useToken from './useToken';

const useArtist = (id: ArtistProps): ArtistResponse => {
  const [loading, setLoading] = useState<boolean>(true);
  const [answer, setAnswer] = useState<any>(null);
  const [error, setError] = useState<FetchError | null>(null);
  const [params] = useToken();

  useEffect(() => {
    if (params) {
      (async () => {
        try {
          const data = await spotifyFetch(`artists/${id}`, params.accessToken);
          await setAnswer({
            uri: data.uri,
            avatar: data.images[0].url,
          });
        } catch (e) {
          console.log(e);
          setError(e as FetchError);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [id, params]);

  return { answer, loading, error };
};

export default useArtist;
