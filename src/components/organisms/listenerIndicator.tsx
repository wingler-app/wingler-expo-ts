import { Motion } from '@legendapp/motion';
import { BlurView } from 'expo-blur';
import type { GestureResponderEvent } from 'react-native';
import { Image, TouchableOpacity, View } from 'react-native';

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
  return (
    <Motion.View
      initial={{ opacity: 0 }}
      animate={{
        opacity: buttonDisabled ? 1 : 1,
      }}
      transition={{ type: 'spring' }}
      className="absolute z-50 flex h-full w-full"
    >
      <BlurView
        tint="dark"
        intensity={60}
        className={`absolute z-50 flex h-full w-full items-center justify-center self-center border-2 border-black
        ${!buttonDisabled ? 'h-0 opacity-0' : 'h-full opacity-100'}
        `}
      />
      <View
        className={`absolute top-10 z-50 w-full items-center justify-center
        ${!buttonDisabled ? 'h-0 opacity-0' : 'h-full opacity-100'}
      `}
      >
        <Motion.View
          className={`absolute h-40 w-40 rounded-full ${
            isSpeechToText ? 'bg-red-300' : 'bg-teal-900'
          }`}
          animate={{
            scale: buttonDisabled ? 1 : 0,
          }}
        />
        <TouchableOpacity onPress={onPress} disabled={buttonDisabled}>
          <Image className="h-[93] w-[100]" source={imageLogo} />
        </TouchableOpacity>
      </View>
    </Motion.View>
  );
};
export default ListenerIndicator;
