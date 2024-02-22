import { useEffect, useRef, useState } from 'react';
import { getColors } from 'react-native-image-colors';
import type { AndroidImageColors } from 'react-native-image-colors/build/types';

import { spotifyFetch } from '@/utils/spotify';

import useToken from './useToken';

const usePlaybackData = () => {
  const [params] = useToken();
  const [playbackData, setPlaybackData] = useState<any | null>(null);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (params) {
      const getPlaybackData = async (
        accessToken: string | null,
      ): Promise<boolean> => {
        if (accessToken) {
          const data = await spotifyFetch('me/player', accessToken, 'GET');
          if (data) {
            let colors = ['black', 'black'];
            if (data?.item?.album?.images[0].url) {
              const { average, darkMuted } = (await getColors(
                data?.item?.album?.images[0].url,
              )) as AndroidImageColors;
              colors = [average, darkMuted];
            }
            const newData = {
              ...data,
              colors,
            };

            // console.log('Has data: ', data);
            if (data?.is_playing !== undefined) {
              // console.log(data.is_playing);
              setPlaybackData(newData);
              return data.is_playing;
            }
            console.log('No is_playing data');
          }
          console.log('No data', new Date());
        } else {
          console.log('no Params');
          return false;
        }
        return false;
      };

      const step = async (mytoken: string | null): Promise<void> => {
        if (intervalIdRef.current) clearTimeout(intervalIdRef.current);

        let playing = false;
        playing = await getPlaybackData(mytoken);
        // console.log('state of playing:', playing);

        intervalIdRef.current = setTimeout(
          () => step(mytoken),
          playing ? 3000 : 10000,
        );
      };

      const subscribe = () => {
        if (!intervalIdRef.current)
          step(params?.accessToken ? params.accessToken : null);
      };

      subscribe();
    }

    const unsubscribe = (): void => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
    return () => {
      unsubscribe();
    };
  }, [params]);

  return playbackData;
};

export default usePlaybackData;
