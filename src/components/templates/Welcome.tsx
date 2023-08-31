import { Link } from 'expo-router';
import { useEffect } from 'react';
import { Image, PermissionsAndroid, Platform, Text, View } from 'react-native';

const test = require('../../../assets/logo.png');

const Welcome = () => {
  const recordAudioRequest = async () => {
    if (Platform.OS === 'android') {
      // Android requires an explicit call to ask for permission
      const granted = await PermissionsAndroid.request(
        // @ts-ignoreh
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: '[Permission explanation]',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    // iOS will automatically ask for permission
    return true;
  };

  useEffect(() => {
    (async () => {
      const hasPermission = await recordAudioRequest();
      console.log(hasPermission);
    })();

    // return () => {
    //   second
    // }
  }, []);

  return (
    <View className="flex-1 items-center justify-center">
      <Text>Hello World!</Text>
      <Image className="h-[92] w-[100]" source={test} />
      <Link href="/wingler">Wingler</Link>
    </View>
  );
};
export { Welcome };
