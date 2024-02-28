import * as Speech from 'expo-speech';
import { useCallback, useState } from 'react';
import { Text, View } from 'react-native';

import { useAskAi } from '@/services/CloudFunctions';
import { speechOptions } from '@/utils/inferenceUtils';

import BubbleWrap from '../atoms/BubbleWrap';
import Button from '../atoms/Button';
import WingModal from '../organisms/Modal';
import Logo from './Logo';

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

  // useEffect(() => {
  //   if (!loading) readAnswer();
  //   return () => {
  //     Speech.stop();
  //   };
  // }, [loading, readAnswer]);

  if (loading)
    return (
      <BubbleWrap type="askAI">
        <Text className="flex-wrap text-xl text-primary-dark">
          Pratar med wingler AI...
        </Text>
      </BubbleWrap>
    );
  console.log('askAI rerender');

  return (
    <BubbleWrap type="askAI">
      <View className="flex flex-col">
        <View className="flex flex-row items-center rounded-full bg-primary-dark p-1">
          <Logo logoStyles="mx-2 w-[45px] h-[45]" />
          <Button
            className={`mb-0 self-center ${
              isSpeaking ? 'bg-red-500' : 'bg-green-500'
            }`}
            title={isSpeaking ? 'Stop ◼' : 'Play ▶'}
            onPress={readAnswer}
          />
        </View>
        <Button
          buttonStyle="mb-0 mt-4  p-0 bg-transparent"
          title="Show transcript"
          onPress={() => setShowAnswer(true)}
        />
        <WingModal
          title={`Answer to "${question}"`}
          visible={showAnswer}
          onClose={() => setShowAnswer(false)}
        >
          {answer}
        </WingModal>
      </View>
    </BubbleWrap>
  );
};

export default AskAI;
