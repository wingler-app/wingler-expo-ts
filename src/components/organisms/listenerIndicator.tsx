import { Motion } from '@legendapp/motion';
import type { GestureResponderEvent } from 'react-native';
import { Image, TouchableOpacity, View } from 'react-native';

const imageLogo = require('../../../assets/logo.png');

type ListenerIndicatorProps = {
  buttonDisabled: boolean;
  onPress: ((event: GestureResponderEvent) => void) | undefined;
};

const ListenerIndicator = ({
  buttonDisabled,
  onPress,
}: ListenerIndicatorProps) => {
  return (
    <View className="absolute top-10 z-50 w-full items-center justify-center">
      <Motion.View
        className="absolute h-40 w-40 rounded-full bg-teal-900"
        animate={{
          scale: buttonDisabled ? 1 : 0,
        }}
      />
      <TouchableOpacity onPress={onPress} disabled={buttonDisabled}>
        <Image className="h-[93] w-[100]" source={imageLogo} />
      </TouchableOpacity>
    </View>
  );
};
export default ListenerIndicator;
