import type { RhinoInference } from '@picovoice/rhino-react-native';
import { router } from 'expo-router';
import * as Speech from 'expo-speech';

import useSettingsStore from '@/store/useSettingsStore';
import type { BotQA } from '@/types';

export const speechOptions: Speech.SpeechOptions = {
  language: 'en-US',
  pitch: 0.75,
  rate: 0.75,
};

export const beverageHandler = (beverage: string): void => {
  switch (beverage) {
    case 'coffee':
      console.log('Going to Settings');
      router.push('settings');
      break;
    case 'espresso':
      console.log('Going to Home');
      router.push('wingler');
      break;
    default:
      console.log('default');
      break;
  }
};

export const prettyPrint = (inference: RhinoInference): string =>
  JSON.stringify(inference, null, 4);

export const goTo = (location: string): void => {
  switch (location) {
    case 'home':
      console.log('Going to Home');
      router.push('/');
      break;
    case 'settings':
      console.log('Going to Settings');
      router.push('settings');
      break;
    case 'chat':
      console.log('Going to Chat');
      router.push('wingler');
      break;
    default:
      console.log('default');
      break;
  }
};

const InferenceHandler = async (
  inference: RhinoInference,
): Promise<string | null | BotQA> => {
  const { intent, slots, isUnderstood } = inference;
  const botQA: BotQA = {
    question: '',
    answer: '',
  };
  const { readAloud } = useSettingsStore.getState();

  if (isUnderstood) {
    console.log(`Inference: ${intent}`);
    switch (intent) {
      case 'showMap':
        return 'maps';
      case 'playMusic':
        if (slots?.musicGenre) {
          botQA.question = `Play ${slots.musicGenre}`;
          botQA.answer = {
            type: 'music',
            params: slots.musicGenre,
          };
          break;
        }
        if (slots?.musicSearch) {
          const search = `music${slots.musicSearch}`;
          return search;
        }
        break;
      case 'appCommands':
        if (slots?.locations) {
          goTo(slots.locations);
          botQA.question = `Go to ${slots.locations}`;
          botQA.answer = 'See you there!';
        }
        if (slots?.playback) {
          botQA.question = `${slots.playback}`;
          botQA.answer = {
            type: 'playback',
            command: slots.playback,
          };
        }
        break;
      case 'askQuestion':
        return 'askAI';
      default:
        console.log("Didn't understand the command");
        return null;
    }
  } else {
    console.log("Didn't understand the command");
    return null;
  }
  if (typeof botQA.answer === 'string' && readAloud) {
    setTimeout(() => Speech.speak(botQA.answer as string, speechOptions), 1000);
  }
  return botQA;
};

export default InferenceHandler;
