import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
// import type { NativeStackNavigationProp } from 'react-native-screens/native-stack';
// import type { StackParamList } from '@/types';
import { router } from 'expo-router';
// import { useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Text, TextInput, View } from 'react-native';

import Button from '../atoms/Button';

const RegisterTemplate = () => {
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [firstname, setFirstname] = useState<string | undefined>();
  const [surname, setSurname] = useState<string | undefined>();
  const [hasCheckedAuth, setHasCheckedAuth] = useState<boolean>(false);
  // const nav = useNavigation<NativeStackNavigationProp<StackParamList>>();

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
    return subscriber; // unsubscribe on unmount
  }, []);

  const createProfile = async (response: any) => {
    const docName = `${firstname}-${surname}-${response.user.uid}`.replace(
      /\s/g,
      '',
    );
    firestore().collection('users').doc(docName.trim()).set({
      created: firestore.FieldValue.serverTimestamp(),
      createdReadable: new Date().toString(),
      firstname,
      surname,
      email,
      uid: response.user.uid,
    });
  };

  const handleSubmit = async () => {
    if (email && password && firstname && surname) {
      console.log(email, password);
      try {
        const response = await auth().createUserWithEmailAndPassword(
          email,
          password,
        );
        if (response.user) {
          await createProfile(response);
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
        <Text className="text-center text-white">Calling Firebase...</Text>
      ) : (
        <>
          <Text className="text-4xl text-white">Register</Text>
          <View className="mt-10">
            <TextInput
              className="mb-4 rounded-xl border-2 border-white p-4 text-white"
              placeholder="Firstname"
              placeholderTextColor="white"
              value={firstname}
              onChangeText={setFirstname}
            />
            <TextInput
              className="mb-4 rounded-xl border-2 border-white p-4 text-white"
              placeholder="Surname"
              placeholderTextColor="white"
              value={surname}
              onChangeText={setSurname}
            />
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
            <Button title="Register" onPress={handleSubmit} />
            <Button title="Login" onPress={() => router.replace('login')} />
          </View>
        </>
      )}
    </View>
  );
};

export default RegisterTemplate;
