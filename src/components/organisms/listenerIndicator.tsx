import { Motion } from '@legendapp/motion';
import { BlurView } from 'expo-blur';
import type { GestureResponderEvent } from 'react-native';
import { Image, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedProps,
  withTiming,
} from 'react-native-reanimated';

const imageLogo = require('../../../assets/logo.png');

type ListenerIndicatorProps = {
  buttonDisabled: boolean;
  isSpeechToText: boolean;
  onPress: ((event: GestureResponderEvent) => void) | undefined;
};

const ListenerIndicator = ({
  buttonDisabled,
  isSpeechToText,
  onPress,
}: ListenerIndicatorProps) => {
  const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
  const animatedProps = useAnimatedProps(() => {
    return {
      intensity: withTiming(buttonDisabled ? 60 : 0, { duration: 300 }),
    };
  });

  return (
    <Motion.View
      initial={{ opacity: 0 }}
      animate={{
        opacity: buttonDisabled ? 1 : 1,
      }}
      transition={{ type: 'spring' }}
      className={`absolute z-50 flex h-full w-full
      ${!buttonDisabled ? 'h-0' : 'h-full'}
      `}
    >
      <AnimatedBlurView
        animatedProps={animatedProps}
        tint="dark"
        className={`absolute flex h-full w-full items-center justify-center self-center border-2 border-black
        ${!buttonDisabled ? 'h-0 opacity-0' : 'h-full opacity-100'}
        `}
      >
        <Motion.View
          className={`absolute h-40 w-40 rounded-full ${
            isSpeechToText ? 'bg-red-300' : ''
          }`}
          animate={{
            scale: buttonDisabled ? 1 : 0,
          }}
        />
        <TouchableOpacity className="absolute " onPress={onPress}>
          <Image className="h-[93] w-[100]" source={imageLogo} />
        </TouchableOpacity>
      </AnimatedBlurView>
    </Motion.View>
  );
};

export default ListenerIndicator;
