import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import Button from '../atoms/Button';
import Modal from './Modal';

const DevHelper = () => {
  const [isOpen, setIsOpen] = useState(false);

  const devNav = (destination: string) => {
    router.push(destination);
    setIsOpen(false);
  };

  const handleClearToken = async () => {
    try {
      await AsyncStorage.removeItem('@SpotifyParams');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View className="w-full">
      <Button
        title=""
        buttonStyle="absolute right-2 bottom-2 p-0 m-0 w-10 h-10 bg-red-600"
        onPress={() => setIsOpen(true)}
      />
      <Modal
        title="DevHelper"
        visible={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <Button title="Settings" onPress={() => devNav('/settings')} />
        <Button title="Chat" onPress={() => devNav('/wingler')} />
        <Text className="mb-6 text-center text-white">---</Text>
        <Button title="Clear Spotify Token" onPress={handleClearToken} />
      </Modal>
    </View>
  );
};
export default DevHelper;
