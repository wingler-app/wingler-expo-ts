import type { RhinoInference } from '@picovoice/rhino-react-native';
import { router } from 'expo-router';
import type * as Speech from 'expo-speech';

export const speechOptions: Speech.SpeechOptions = {
  language: 'en-US',
  pitch: 0.75,
  rate: 0.75,
};
export const prettyPrint = (inference: RhinoInference): string =>
  JSON.stringify(inference, null, 4);

export type Slots = RhinoInference['slots'];

export const goTo = (location: string): void => {
  switch (location) {
    case 'home':
      router.push('/');
      break;
    case 'settings':
      router.push('settings');
      break;
    case 'chat':
      router.push('home');
      break;
    default:
      console.log('default');
      break;
  }
};

export const handlePlayMusic = (slots: Slots) => {
  if (slots?.musicGenre)
    return {
      question: `Play ${slots.musicGenre}`,
      answer: {
        type: 'music',
        params: slots.musicGenre,
      },
    };

  if (slots?.musicSearch) return `music${slots.musicSearch}`;
  return null;
};
