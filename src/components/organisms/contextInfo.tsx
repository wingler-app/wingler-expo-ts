import type { GestureResponderEvent } from 'react-native';
import { Text, TouchableOpacity, View } from 'react-native';

type ContextInfoProps = {
  showContextInfo: ((event: GestureResponderEvent) => void) | undefined;
  showInferenceInfo: ((event: GestureResponderEvent) => void) | undefined;
};

const ContextInfo = ({
  showContextInfo,
  showInferenceInfo,
}: ContextInfoProps) => {
  return (
    <View className="flex flex-row items-center justify-between bg-black">
      <Text className="ml-5 font-bold text-gray-700">wingler™ by Mektig</Text>
      <View className="m-2 flex-row">
        <TouchableOpacity
          className="mr-2 rounded-full bg-yellow-300"
          onPress={showContextInfo}
        >
          <Text className="px-2  text-black">Context Info</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="rounded-full bg-yellow-300"
          onPress={showInferenceInfo}
        >
          <Text className="px-2  text-black">Inference</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ContextInfo;
