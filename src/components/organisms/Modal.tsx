import type { TextProps } from 'react-native';
import { Modal, ScrollView, Text, View } from 'react-native';

import Button from '../atoms/Button';
import { P } from '../atoms/Words';

interface WingModalProps {
  title?: string;
  children: TextProps['children'] | string;
  visible: boolean;
  onClose: () => void | undefined;
}

const WingModal = ({ children, visible, onClose, title }: WingModalProps) => {
  const content =
    typeof children === 'string' ? (
      <P dark size="sm" className="px-4 text-left">
        {children}
      </P>
    ) : (
      children
    );

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      statusBarTranslucent
    >
      <View className="flex-1 justify-center bg-[#000000cc]">
        <View className="m-6 mt-14 flex justify-center rounded-lg bg-primary-dark">
          <ScrollView>
            {title && (
              <Text className="p-4 text-xl font-bold text-accent">{title}</Text>
            )}
            {content}
          </ScrollView>
          <Button title="Close" buttonStyle="m-4" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default WingModal;
