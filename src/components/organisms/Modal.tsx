import { Modal, ScrollView, Text, View } from 'react-native';

import Button from '../atoms/Button';

interface WingModalProps {
  title?: string;
  info: string;
  visible: boolean;
  onClose: () => void | undefined;
}

const WingModal = ({ info, visible, onClose, title }: WingModalProps) => {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      statusBarTranslucent
    >
      <View className="flex-1 justify-center bg-[#000000cc]">
        <View className="m-6 mt-14 flex justify-center rounded-lg bg-primary p-4">
          <ScrollView className="m-4 mb-10">
            {title && (
              <Text className="mb-4 text-xl font-bold text-accent-secondary">
                {title}
              </Text>
            )}
            <Text className="text-base text-white">{info}</Text>
          </ScrollView>
          <Button title="Close" buttonStyle="mb-0" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default WingModal;
