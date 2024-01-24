import { createMotionAnimatedComponent, Motion } from '@legendapp/motion';
import { BlurView } from 'expo-blur';
import type { GestureResponderEvent } from 'react-native';
import { Text, TouchableOpacity, View } from 'react-native';

import Logo from '../molecules/Logo';

type ListenerIndicatorProps = {
  isListening: boolean;
  isSpeechToText: boolean;
  onPress: ((event: GestureResponderEvent) => void) | undefined;
};

const AnimatedBlurView = createMotionAnimatedComponent(BlurView);

const ListenerIndicator = ({
  isListening,
  isSpeechToText,
  onPress,
}: ListenerIndicatorProps) => {
  return (
    <AnimatedBlurView
      initialProps={{ intensity: 0 }}
      animateProps={{
        intensity: isListening ? 60 : 10,
      }}
      tint="dark"
      className="absolute z-40 flex h-full w-full items-center justify-center self-center"
    >
      <Motion.View
        className={`absolute h-40 w-40 rounded-full ${
          isSpeechToText ? 'border-4 border-accent-secondary' : ''
        }`}
        animate={{
          scale: isSpeechToText ? 1 : 0,
        }}
      />
      <Motion.View
        className="absolute h-full w-full bg-primary-dark"
        animate={{
          opacity: isListening ? 0.3 : 0,
        }}
      />
      <TouchableOpacity className="absolute " onPress={onPress}>
        <Logo animation={isSpeechToText ? 'idle' : 'wave'} />
      </TouchableOpacity>
      <View className="absolute bottom-60">
        {isSpeechToText ? (
          <Text className="text-4xl text-white">Listening...</Text>
        ) : (
          <View className="flex flex-row">
            <Text className="m-1 rounded-full bg-accent px-4 py-1">maps</Text>
            <Text className="m-1 rounded-full bg-accent-secondary px-4 py-1">
              play
            </Text>
            <Text className="m-1 rounded-full bg-red-500 px-4 py-1">stop</Text>
          </View>
        )}
      </View>
    </AnimatedBlurView>
  );
};

export default ListenerIndicator;
