import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

import type { DeviceType, FetchError } from '@/types/spotify';
import { spotifyFetch } from '@/utils/spotify';

import useToken from './useToken';

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
          const data = await spotifyFetch(
            `me/player/devices`,
            params.access_token,
          );
          if (data.error) throw new Error(data.error.message);
          if (data.devices.length === 0) throw new Error('No devices found');
          await setDevices(data.devices);
        } catch (e) {
          setError(e as FetchError);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [params]);

  return [device, devices, loading, error];
};

export default useDevice;
