import type { GestureResponderEvent } from 'react-native';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface WingModalProps {
  info: string;
  visible: boolean;
  onClose: ((event: GestureResponderEvent) => void) | undefined;
}

const WingModal = ({ info, visible, onClose }: WingModalProps) => {
  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View className="m-10 mt-24 flex-1 rounded-lg bg-white p-4">
        <ScrollView className="mb-4 flex-[]">
          <Text className="text-black">{info}</Text>
        </ScrollView>
        <TouchableOpacity
          className="flex-[0.05] justify-center self-center bg-blue-700 p-1"
          onPress={onClose}
        >
          <Text className="text-white">CLOSE</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default WingModal;
