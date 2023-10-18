import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { promptOpenAI } from '@/utils/handleQuestion';
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
  const [answer, setAnswer] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  useEffect(() => {
    if (!answer) {
      (async () => {
        try {
          const aiAnswer = await promptOpenAI(question);
          Speech.speak(aiAnswer, speechOptions);
          setAnswer(aiAnswer);
        } catch (e) {
          console.log(e);
        }
      })();
    }

    return () => {
      Speech.stop();
    };
  }, [question, answer]);

  const handleClick = () => {
    if (!answer) return;
    Speech.speak(answer, speechOptions);
  };

  if (!answer)
    return (
      <BubbleWrap type="askAI">
        <Text className="flex-wrap text-xl text-primary-dark">
          Connecting to SkyNet...
        </Text>
      </BubbleWrap>
    );

  return (
    <BubbleWrap type="askAI">
      <View className="flex flex-col">
        <Button title="Play ▶" onPress={handleClick} />
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
