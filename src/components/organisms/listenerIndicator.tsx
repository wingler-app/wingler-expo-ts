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
      <TouchableOpacity
        className={`h-40 w-40 items-center justify-center  rounded-full ${
          buttonDisabled ? 'bg-teal-900' : ''
        }`}
        onPress={onPress}
        disabled={buttonDisabled}
      >
        <Image className="h-[92] w-[100]" source={imageLogo} />
      </TouchableOpacity>
    </View>
  );
};
export default ListenerIndicator;
