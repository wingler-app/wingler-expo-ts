import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { useAskAi } from '@/services/CloudFunctions';
import { speechOptions } from '@/utils/inference';

import BubbleWrap from '../atoms/BubbleWrap';
import Button from '../atoms/Button';
import WingModal from '../organisms/Modal';

type AskAIProps = {
  content: {
    question: string;
  };
};

const AskAI = ({ content: { question } }: AskAIProps) => {
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [answer, loading] = useAskAi(question);

  const readAnswer = () => {
    if (!answer) return;
    Speech.speak(answer, speechOptions);
  };

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  if (loading || answer === '')
    return (
      <BubbleWrap type="askAI">
        <Text className="flex-wrap text-xl text-primary-dark">
          Connecting to SkyNet...
        </Text>
      </BubbleWrap>
    );

  readAnswer();

  return (
    <BubbleWrap type="askAI">
      <View className="flex flex-col">
        <Button title="Play ▶" onPress={readAnswer} />
        <Button
          buttonStyle="mb-0 p-0 bg-transparent"
          title="Show Answer"
          onPress={() => setShowAnswer(true)}
        />
        <WingModal
          title={`Answer to "${question}"`}
          info={answer}
          visible={showAnswer}
          onClose={() => setShowAnswer(false)}
        />
      </View>
    </BubbleWrap>
  );
};

export default AskAI;
