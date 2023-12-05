import { createMotionAnimatedComponent, Motion } from '@legendapp/motion';
import { BlurView } from 'expo-blur';
import type { GestureResponderEvent } from 'react-native';
import { Image, TouchableOpacity } from 'react-native';

const imageLogo = require('../../../assets/logo.png');

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
          isSpeechToText ? 'bg-orange-500' : ''
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
        <Image className="h-[93] w-[100]" source={imageLogo} />
      </TouchableOpacity>
    </AnimatedBlurView>
  );
};

export default ListenerIndicator;
