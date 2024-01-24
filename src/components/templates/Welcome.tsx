import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';
import { useFonts } from 'expo-font';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, PermissionsAndroid, Platform, View } from 'react-native';

import Button from '../atoms/Button';
import Logo from '../molecules/Logo';

const test = require('../../../assets/logo.png');

const Welcome = () => {
  const [hasCheckedAuth, setHasCheckedAuth] = useState<boolean>(false);
  const [,] = useFonts({
    'Moon-Regular': require('../../../assets/fonts/Moon2.0-Regular.otf'),
    'Moon-Light': require('../../../assets/fonts/Moon2.0-Light.otf'),
    'Moon-Bold': require('../../../assets/fonts/Moon2.0-Bold.otf'),
  });

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

  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    setTimeout(() => {
      if (user) {
        router.push('home');
        console.log('User is signed in');
      } else {
        setHasCheckedAuth(true);
        console.log('User is signed out');
      }
    }, 1000);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    (async () => {
      const hasPermission = await recordAudioRequest();
      console.log(hasPermission);
    })();

    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-primary-dark">
      {!hasCheckedAuth ? (
        <Logo animation="loading" />
      ) : (
        <>
          <Image className="h-[92] w-[100]" source={test} />
          <Button
            buttonStyle="m-10"
            title="Get Started"
            onPress={() => router.push('login')}
          />
        </>
      )}
    </View>
  );
};
export { Welcome };
