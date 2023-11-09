import AsyncStorage from '@react-native-async-storage/async-storage';

import type { DeviceType } from '@/types/spotify';
import { spotifyFetch } from '@/utils/spotify';

import useToken from './useToken';

type PlaybackPlay = (url: string) => Promise<void>;
type PlaybackStop = () => Promise<void>;

type PlaybackResponse = {
  play: PlaybackPlay;
  stop: PlaybackStop;
};

const usePlayback = (): PlaybackResponse => {
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
        const data = await AsyncStorage.getItem('@SpotifyDevice');
        if (data) {
          const device: DeviceType = JSON.parse(data);
          const url = `me/player/play?device_id=${device.id}`;
          console.log(url);
          await spotifyFetch(url, params.access_token, 'PUT', body);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const stop = async () => {
    if (params)
      await spotifyFetch('me/player/pause', params.access_token, 'PUT');
  };

  return { play, stop };
};

export default usePlayback;
