import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { memo, useState } from 'react';
import { View } from 'react-native';

import useHistoryStore from '@/store/useHistoryStore';
import type { BotQA } from '@/types';

import Button from '../atoms/Button';
import Modal from './Modal';

const DevHelper = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { history, clearHistory, addToHistory } = useHistoryStore();

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

  const handleBrownNoise = () => {
    const botQA: BotQA = {
      question: 'Brown Noise',
      answer: {
        question: 'Brown Noise',
        type: 'musicsong',
      },
    };
    addToHistory(botQA);
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
        <Button
          title="Settings"
          type="list"
          onPress={() => devNav('/settings')}
        />
        <Button type="list" title="Chat" onPress={() => devNav('/home')} />
        <Button
          type="list"
          title="Clear Spotify Token"
          onPress={handleClearToken}
        />
        <Button type="list" title="Clear History" onPress={clearHistory} />
        <Button
          type="list"
          title="Log History"
          onPress={() => console.log(JSON.stringify(history, undefined, 2))}
        />
        <Button type="list" title="Brown Noise" onPress={handleBrownNoise} />
      </Modal>
    </View>
  );
};
export default memo(DevHelper);
