import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Text, TextInput, View } from 'react-native';

import Button from '../atoms/Button';
import Logo from '../molecules/Logo';

const RegisterTemplate = () => {
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [hasCheckedAuth, setHasCheckedAuth] = useState<boolean>(false);

  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    setTimeout(() => {
      if (user) {
        router.replace('home');
        console.log('User is signed in');
      } else {
        setHasCheckedAuth(true);
        console.log('User is NOT signed in');
      }
    }, 1000);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const handleSubmit = async () => {
    if (email && password) {
      console.log(email, password);
      try {
        const response = await auth().signInWithEmailAndPassword(
          email,
          password,
        );
        if (response.user) {
          console.log('user signed in');
        }
      } catch (e: any) {
        console.log(typeof e);
        const { message } = e;
        Alert.alert('Error', message);
      }
    }
  };

  return (
    <View className="flex-1 justify-center bg-primary-dark px-5 ">
      {!hasCheckedAuth ? (
        <Logo animation="loading" />
      ) : (
        <>
          <Text className="text-4xl text-white">Login</Text>
          <View className="mt-10">
            <TextInput
              className="mb-4 rounded-xl border-2 border-white p-4 text-white"
              placeholder="E-mail"
              placeholderTextColor="white"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              className="mb-8 rounded-xl border-2 border-white p-4 text-white"
              placeholder="Password"
              secureTextEntry
              placeholderTextColor="white"
              value={password}
              onChangeText={setPassword}
            />
            <Button title="Login" onPress={handleSubmit} />
            <Button
              title="Register"
              onPress={() => router.replace('register')}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default RegisterTemplate;
