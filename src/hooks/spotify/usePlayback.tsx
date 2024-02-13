import AsyncStorage from '@react-native-async-storage/async-storage';

import type { DeviceType } from '@/types/spotify';
import { spotifyFetch } from '@/utils/spotify';

import useToken from './useToken';

type PlaybackPlay = (url?: string) => Promise<void>;
type PlaybackStop = () => Promise<void>;
type PlaybackNext = () => Promise<void>;
type PlaybackPrevious = () => Promise<void>;

type PlaybackResponse = {
  play: PlaybackPlay;
  stop: PlaybackStop;
  next: PlaybackNext;
  prev: PlaybackPrevious;
};

const usePlayback = (): PlaybackResponse => {
  const [params] = useToken();

  const play = async (uri?: string) => {
    if (params) {
      try {
        const data = await AsyncStorage.getItem('@SpotifyDevice');
        if (data) {
          const device: DeviceType = JSON.parse(data);
          const url = `me/player/play?device_id=${device.id}`;
          console.log(url);
          if (uri) {
            const body = JSON.stringify({
              uris: [uri],
              offset: {
                position: 0,
              },
              position_ms: 0,
            });
            await spotifyFetch(url, params.accessToken, 'PUT', body);
          } else {
            await spotifyFetch(url, params.accessToken, 'PUT', '');
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const stop = async () => {
    if (params)
      await spotifyFetch('me/player/pause', params.accessToken, 'PUT');
  };

  const next = async () => {
    if (params)
      await spotifyFetch('me/player/next', params.accessToken, 'POST');
  };

  const prev = async () => {
    if (params)
      await spotifyFetch('me/player/previous', params.accessToken, 'POST');
  };

  return { play, stop, next, prev };
};

export default usePlayback;
