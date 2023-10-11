import { firebase } from '@react-native-firebase/functions';

export const promptOpenAI = async (question: string): Promise<string> => {
  const { data } = await firebase.functions().httpsCallable('askAI')({
    question,
  });

  return data.answer;
};
