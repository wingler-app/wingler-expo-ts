import { useState } from 'react';
import { Text, View } from 'react-native';

import Button from '../atoms/Button';
import WingModal from './Modal';

type ContextInfoProps = {
  rhinoText: string | undefined;
  contextInfo: string | undefined;
};

const ContextInfo = ({ rhinoText, contextInfo }: ContextInfoProps) => {
  const [showContextInfo, setShowContextInfo] = useState<boolean>(false);
  const [showInferenceInfo, setShowInferenceInfo] = useState<boolean>(false);

  return (
    <View className="flex flex-row items-center justify-between bg-primary-dark">
      <Text className="ml-5 font-bold text-gray-700">wingler™ by Mektig</Text>
      <View className="m-2 flex-row">
        <Button
          buttonStyle="p-0 px-2 m-0"
          title="Context"
          onPress={() => setShowContextInfo(true)}
        />
        <Button
          buttonStyle="p-0 px-2 m-0"
          title="Inference"
          onPress={() => setShowInferenceInfo(true)}
        />
      </View>
      <WingModal
        title="Context Info"
        visible={showContextInfo}
        onClose={() => setShowContextInfo(false)}
      >
        <Text>{contextInfo}</Text>
      </WingModal>
      <WingModal
        title="Inference"
        visible={showInferenceInfo}
        onClose={() => setShowInferenceInfo(false)}
      >
        <Text>{rhinoText}</Text>
      </WingModal>
    </View>
  );
};

export default ContextInfo;
