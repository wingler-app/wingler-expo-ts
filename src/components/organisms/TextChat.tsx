import { useRef, useState } from 'react';
import { TextInput, View } from 'react-native';

import useHistoryStore from '@/store/useHistoryStore';

import type { IconProps } from '../atoms/Button';
import Button from '../atoms/Button';

type ButtonMapType = {
  [key: string]: IconProps['icon'];
};

const ButtonModeMap: ButtonMapType = {
  map: 'map',
  music: 'musical-note',
  help: 'help',
};

type ButtonMode = keyof typeof ButtonModeMap;

const TextChat = () => {
  const [text, setText] = useState<string>('');
  const [mode, setMode] = useState<ButtonMode>('map');

  const inputRef = useRef<TextInput>(null);
  const modes: ButtonMode[] = Object.keys(ButtonModeMap);

  const { addToHistory } = useHistoryStore();

  const switchMode = () => {
    const currentIndex = modes.indexOf(mode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setMode(modes[nextIndex] as ButtonMode);
  };

  const handleSend = () => {
    if (text === '') return;
    if (text.toLocaleLowerCase() === 'stop') {
      addToHistory({
        question: text,
        answer: {
          type: 'playback',
          command: 'stop',
        },
      });
      return;
    }

    switch (mode) {
      case 'map':
        addToHistory({
          question: text,
          answer: {
            question: text,
            type: 'maps',
          },
        });
        break;
      case 'music':
        addToHistory({
          question: text,
          answer: {
            question: text,
            type: 'musicsong',
          },
        });
        break;
      case 'help':
        addToHistory({
          question: text,
          answer: {
            type: 'askAI',
          },
        });
        break;
      default:
        break;
    }
    setText('');
    inputRef.current?.clear();
  };

  return (
    <View className="absolute inset-x-0 bottom-0 z-50 w-full p-6">
      <View className="flex flex-row rounded-full border-[1px] border-[#45415b] bg-[#393450] shadow-sm shadow-black">
        <Button
          icon={ButtonModeMap[mode] as IconProps['icon']}
          type="iconOnly"
          className="mx-2 mb-0 flex-none border-transparent bg-transparent"
          onPress={switchMode}
        />
        <TextInput
          ref={inputRef}
          placeholderTextColor="white"
          placeholder="Write here..."
          className="flex h-12 grow rounded-md text-white placeholder:text-white"
          onChangeText={(e) => setText(e)}
        />
        <Button
          icon="send"
          type="minimal"
          className="mb-0 ml-2 flex-none"
          onPress={handleSend}
        />
      </View>
    </View>
  );
};

export default TextChat;
