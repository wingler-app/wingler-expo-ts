import { firebase } from '@react-native-firebase/functions';
import { useEffect, useState } from 'react';

type AskAIProps = string;
type AskAIResponse = [string, boolean];

const useAskAi = (question: AskAIProps): AskAIResponse => {
  const [loading, setLoading] = useState<boolean>(true);
  const [answer, setAnswer] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const { data } = await firebase.functions().httpsCallable('askAI')({
          question,
        });
        if (isMounted) {
          await setAnswer(data.answer);
          setLoading(false);
        }
      } catch (e) {
        console.error('OpenAI error: ', e);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [question]);

  return [answer, loading];
};

const useAskSummary = (question: AskAIProps): AskAIResponse => {
  const [loading, setLoading] = useState<boolean>(true);
  const [answer, setAnswer] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const { data } = await firebase.functions().httpsCallable('askSummery')(
          {
            question,
          },
        );
        if (isMounted) {
          await setAnswer(data.answer);
          console.log('data.answer', data.answer);
          setLoading(false);
        }
      } catch (e) {
        console.error('OpenAI error: ', e);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [question]);

  return [answer, loading];
};

export { useAskAi, useAskSummary };
