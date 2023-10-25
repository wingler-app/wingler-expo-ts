import * as Speech from 'expo-speech';
import { useCallback, useEffect, useState } from 'react';
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
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const editedSpeechOptions = speechOptions;

  editedSpeechOptions.onStart = () => setIsSpeaking(true);
  editedSpeechOptions.onDone = () => setIsSpeaking(false);
  editedSpeechOptions.onStopped = () => setIsSpeaking(false);

  const readAnswer = useCallback(() => {
    if (loading) return;
    Speech.isSpeakingAsync().then((isTalking) => {
      if (isTalking) return Speech.stop();
      return Speech.speak(answer, speechOptions);
    });
  }, [loading, answer]);

  useEffect(() => {
    if (!loading) readAnswer();
    return () => {
      Speech.stop();
    };
  }, [loading, readAnswer]);

  if (loading)
    return (
      <BubbleWrap type="askAI">
        <Text className="flex-wrap text-xl text-primary-dark">
          Connecting to SkyNet...
        </Text>
      </BubbleWrap>
    );
  console.log('askAI rerender');

  return (
    <BubbleWrap type="askAI">
      <View className="flex flex-col">
        <Button
          title={isSpeaking ? 'Stop ◼' : 'Play ▶'}
          onPress={readAnswer}
        />
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
