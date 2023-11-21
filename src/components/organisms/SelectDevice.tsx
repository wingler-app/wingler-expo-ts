import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import Button from '@/components/atoms/Button';
import WingModal from '@/components/organisms/Modal';
import type { DeviceType, FetchError } from '@/types/spotify';
import { spotifyFetch } from '@/utils/spotify';

import useToken from '../../hooks/spotify/useToken';

const SelectDevice = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [device, setDevice] = useState<DeviceType | null>(null);
  const [devices, setDevices] = useState<DeviceType[]>([]);
  const [error, setError] = useState<FetchError | null>(null);
  const [params] = useToken();
  const [showDevices, setShowDevices] = useState(false);

  const saveDevice = async (deviceObj: { id: number; name: string }) => {
    try {
      await AsyncStorage.setItem('@SpotifyDevice', JSON.stringify(deviceObj));
      setDevice(deviceObj);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await AsyncStorage.getItem('@SpotifyDevice');
        if (data) setDevice(JSON.parse(data));
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  useEffect(() => {
    if (params) {
      (async () => {
        try {
          const data = await spotifyFetch(
            `me/player/devices`,
            params.accessToken,
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

  if (loading) return <Text className="text-white">Loading...</Text>;
  return (
    devices && (
      <>
        <View className="relative">
          <Button
            title="Select Spotify Device"
            type="menu"
            onPress={() => setShowDevices(true)}
          />
          <Text className="my-2 w-full text-center text-xs text-secondary">
            <Text className="text-white">Playing on:</Text> {device?.name}
          </Text>
        </View>
        <WingModal
          title="Devices"
          visible={showDevices}
          onClose={() => setShowDevices(false)}
        >
          {error ? (
            <Text className="text-white">{error.message}</Text>
          ) : (
            <>
              {devices.map(({ id, name }) => (
                <View key={id}>
                  <Button
                    title={name}
                    type="list"
                    onPress={() => {
                      if (saveDevice) {
                        saveDevice({ id, name });
                        setShowDevices(false);
                      }
                    }}
                  />
                </View>
              ))}
            </>
          )}
        </WingModal>
      </>
    )
  );
};

export default SelectDevice;
