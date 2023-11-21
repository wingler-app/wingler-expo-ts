import auth from '@react-native-firebase/auth';
import { router } from 'expo-router';
import { Image, ScrollView, View } from 'react-native';

import SelectDevice from '@/components/organisms/SelectDevice';
import useToken from '@/hooks/spotify/useToken';

import Button from '../atoms/Button';
import MenuSectionTitle from '../atoms/MenuSectionTitle';
import DevHelper from '../organisms/DevHelper';

const imageLogo = require('../../../assets/logo.png');

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
    <ScrollView className="flex-1 bg-primary-black">
      <Image
        className=" mb-24 mt-32 h-[93] w-[100] self-center"
        source={imageLogo}
      />
      <DevHelper />
      <View className="flex-1 bg-primary-black">
        <MenuSectionTitle title="Spotify" />
        <Button
          disabled={!request}
          title="Get Spotify Token"
          type="menu"
          onPress={() => promptAsync()}
        />
        {params?.refreshToken !== undefined && (
          <>
            <Button
              disabled={!request}
              title="Refresh Spotify Token"
              type="menu"
              onPress={() =>
                handleToken('refresh_token', params.refreshToken as string)
              }
            />
            <SelectDevice />
          </>
        )}
        <MenuSectionTitle title="Account" />
        <Button
          buttonStyle="border-b-2"
          title="Logout"
          type="menu"
          onPress={handleLogout}
        />
      </View>
    </ScrollView>
  );
}
