import auth from '@react-native-firebase/auth';
import { router } from 'expo-router';
import { Text, View } from 'react-native';

import SelectDevice from '@/components/organisms/SelectDevice';
import useToken from '@/hooks/spotify/useToken';

import Button from '../atoms/Button';
import DevHelper from '../organisms/DevHelper';

export default function SettingsTemplate() {
  const [params, request, promptAsync, , handleToken] = useToken();

  const handleLogout = async () => {
    auth()
      .signOut()
      .then(() => {
        console.log('User signed out!');
        router.push('/');
      });
  };

  return (
    <View className="flex-1 items-center justify-center bg-primary-dark">
      <Button
        disabled={!request}
        title="Get Spotify Token"
        onPress={() => promptAsync()}
      />
      {params?.refresh_token && (
        <>
          <Button
            disabled={!request}
            title="Refresh Spotify Token"
            onPress={() => handleToken('refresh_token', params.refresh_token)}
          />
          <SelectDevice />

          <Text className="m-4 rounded border-2 border-white p-4 text-white">
            {params.access_token}
          </Text>
        </>
      )}
      <Button title="Logout" onPress={handleLogout} />
      <DevHelper />
    </View>
  );
}
