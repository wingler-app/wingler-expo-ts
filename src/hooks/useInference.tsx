import type { RhinoInference } from '@picovoice/rhino-react-native';
import * as Speech from 'expo-speech';
import { useCallback, useMemo } from 'react';

import useHistoryStore from '@/store/useHistoryStore';
import useSettingsStore from '@/store/useSettingsStore';
import type { BotQA } from '@/types';
import type { Slots } from '@/utils/inferenceUtils';
import { goTo, handlePlayMusic, speechOptions } from '@/utils/inferenceUtils';

import usePlayback from './spotify/usePlayback';

export const useInference = () => {
  const { readAloud } = useSettingsStore();
  const { stop } = usePlayback();
  const { addCommand } = useHistoryStore();

  const playback = useCallback(
    (command: string) => {
      if (command === 'stop') {
        Speech.stop();
        stop();
      }

      addCommand({ type: 'playback', command });
    },
    [stop, addCommand],
  );

  const handleAppCommands = useCallback(
    (slots: Slots) => {
      if (slots?.locations) {
        if (slots.locations === 'maps' || slots.locations === 'google maps') {
          playback('go');
        } else {
          goTo(slots.locations);
        }
      }
      if (slots?.playback) {
        playback(slots.playback);
      }
      return null;
    },
    [playback],
  );

  const intentHandlers = useMemo(
    () => ({
      showMap: () => 'maps',
      playMusic: (slots: Slots) => handlePlayMusic(slots),
      appCommands: (slots: Slots) => handleAppCommands(slots),
      askQuestion: () => 'askAI',
    }),
    [handleAppCommands],
  );

  const handleInference = async (
    inference: RhinoInference,
  ): Promise<string | null | BotQA> => {
    const { intent, slots, isUnderstood } = inference;

    if (!isUnderstood) return null;

    const handler = intentHandlers[intent as keyof typeof intentHandlers];
    if (!handler) return null;

    const result = handler(slots);
    if (typeof result === 'string' && readAloud) {
      setTimeout(() => Speech.speak(result, speechOptions), 1000);
    }
    goTo('chat');
    return result;
  };

  // useEffect(() => {
  // Here you can subscribe to the event that triggers the inference handling
  // For example:
  // eventEmitter.on('inference', handleInference);

  // Don't forget to unsubscribe on cleanup
  // return () => {
  // eventEmitter.off('inference', handleInference);
  // };
  // }, []);

  return { handleInference };
};
