import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, PermissionsAndroid, Platform, Text, View } from 'react-native';

import Button from '../atoms/Button';

const test = require('../../../assets/logo.png');

const Welcome = () => {
  const [hasCheckedAuth, setHasCheckedAuth] = useState<boolean>(false);

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
        router.push('wingler');
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
        <Text className="text-4xl text-white">Calling firebase</Text>
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
