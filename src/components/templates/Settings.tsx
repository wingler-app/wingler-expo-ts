import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { useDevice, useToken } from '@/services/Spotify';

import Button from '../atoms/Button';
import WingModal from '../organisms/Modal';

export default function SettingsTemplate() {
  const [params, request, promptAsync] = useToken();
  const [device, devices, loading, error] = useDevice();
  const [showDevices, setShowDevices] = useState(false);

  const handleLogout = async () => {
    auth()
      .signOut()
      .then(() => {
        console.log('User signed out!');
        router.push('/');
      });
  };

  const handleSaveDevice = async (deviceObj: { id: number; name: string }) => {
    try {
      await AsyncStorage.setItem('@SpotifyDevice', JSON.stringify(deviceObj));
      setShowDevices(false);
    } catch (e) {
      console.log(e);
    }
  };
  if (!params || loading) return <Text>loading...</Text>;
  if (error) return <Text>{error.message}</Text>;
  return (
    <View className="flex-1 items-center justify-center bg-primary-dark">
      <Button
        disabled={!request}
        title="Get Spotify Token"
        onPress={() => promptAsync()}
      />
      <Text className="text-white">{device?.name}</Text>
      <Button
        title="Select Spotify Device"
        onPress={() => setShowDevices(true)}
      />

      <Text className="m-4 rounded border-2 border-white p-4 text-white">
        {params.access_token}
      </Text>

      <Button title="Logout" onPress={handleLogout} />
      {devices && (
        <WingModal
          title="Devices"
          visible={showDevices}
          onClose={() => setShowDevices(false)}
        >
          <View className="">
            {devices.map(({ id, name }) => (
              <View key={id}>
                <Button
                  title={name}
                  onPress={() => handleSaveDevice({ id, name })}
                />
              </View>
            ))}
          </View>
        </WingModal>
      )}
    </View>
  );
}
