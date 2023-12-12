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

  const handleMapsDemo = () => {
    const botQA: BotQA = {
      done: true,
      question: 'McDonalds',
      answer: {
        question: 'McDonalds',
        image: null,
        locations: {
          start: {
            latitude: 59.3739838,
            longitude: 16.5047215,
          },
          mid: {
            latitude: 59.37284779285594,
            longitude: 16.5080686120936,
            latitudeDelta: 0.0027265199999902735,
            longitudeDelta: 0.00803279999999944,
          },
          answer: {
            latitude: 59.371711700000006,
            longitude: 16.5114155,
          },
          adress: 'Kriebsensgatan 6, 632 20 Eskilstuna, Sweden',
        },
        type: 'maps',
      },
    };
    addToHistory(botQA);
  };

  return (
    <View className="w-full">
      <Button
        title=""
        buttonStyle="absolute right-2 bottom-2 p-0 m-0 w-10 h-10 bg-primary-black"
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
        <Button type="list" title="Maps Demo" onPress={handleMapsDemo} />
        {/* <PlaceHolderText /> */}
      </Modal>
    </View>
  );
};
export default memo(DevHelper);
