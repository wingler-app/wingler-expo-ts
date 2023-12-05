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
export const prettyPrint = (inference: RhinoInference): string =>
  JSON.stringify(inference, null, 4);

type Slots = RhinoInference['slots'];

const handlePlayMusic = (slots: Slots) => {
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

const handleAppCommands = (slots: Slots) => {
  if (slots?.locations) {
    goTo(slots.locations);
    return null;
  }
  if (slots?.playback) {
    return {
      question: `${slots.playback}`,
      answer: {
        type: 'playback',
        command: slots.playback,
      },
    };
  }
  return null;
};

const intentHandlers = {
  showMap: () => 'maps',
  playMusic: (slots: Slots) => handlePlayMusic(slots),
  appCommands: (slots: Slots) => handleAppCommands(slots),
  askQuestion: () => 'askAI',
};

const InferenceHandler = async (
  inference: RhinoInference,
): Promise<string | null | BotQA> => {
  const { intent, slots, isUnderstood } = inference;

  if (!isUnderstood) return null;

  const handler = intentHandlers[intent as keyof typeof intentHandlers];
  if (!handler) return null;

  const result = handler(slots);
  if (typeof result === 'string' && useSettingsStore.getState().readAloud) {
    setTimeout(() => Speech.speak(result, speechOptions), 1000);
  }

  return result;
};

export default InferenceHandler;
