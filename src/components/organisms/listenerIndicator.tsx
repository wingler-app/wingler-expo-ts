import type { GestureResponderEvent, ImageSourcePropType } from 'react-native';
import { Image, TouchableOpacity, View } from 'react-native';

type ListenerIndicatorProps = {
  isError: boolean;
  buttonColor: string;
  buttonDisabled: boolean;
  imageLogo: ImageSourcePropType;
  onPress: ((event: GestureResponderEvent) => void) | undefined;
};

const ListenerIndicator = ({
  isError,
  buttonColor,
  buttonDisabled,
  imageLogo,
  onPress,
}: ListenerIndicatorProps) => {
  return (
    <View className="absolute top-10 z-50 w-full items-center justify-center">
      <TouchableOpacity
        className={`h-40 w-40 items-center justify-center ${
          isError ? 'bg-red-600' : ''
        } ${buttonColor} rounded-full`}
        onPress={onPress}
        disabled={buttonDisabled || isError}
      >
        <Image className="h-[92] w-[100]" source={imageLogo} />
      </TouchableOpacity>
    </View>
  );
};
export default ListenerIndicator;
