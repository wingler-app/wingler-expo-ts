import { PicovoiceManager } from '@picovoice/picovoice-react-native';
import type { RhinoInference } from '@picovoice/rhino-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Voice from '@react-native-voice/voice';
import { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

import { useInference } from '@/hooks/useInference';
import useHistoryStore from '@/store/useHistoryStore';
import type { BotQA } from '@/types';
import { prettyPrint } from '@/utils/inferenceUtils';

import ContextInfo from './ContextInfo';
import ListenerIndicator from './ListenerIndicator';

const ACCESS_KEY: string =
  '+RCoyTvNL56a5KKlvIIWNNaHB6PfwqPSB/B2N2gIGMvXGnY2LGXLxA==';

const Wingler = () => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [rhinoText, setRhinoText] = useState<string>('');
  const [contextInfo, setContextInfo] = useState<string>('');
  const [isSpeechToText, setIsSpeechToText] = useState<boolean>(false);

  const picovoiceManager = useRef<PicovoiceManager>();
  const fromVoiceBubbleType = useRef<string>('');
  const { addToHistory, clearHistory } = useHistoryStore();
  const { handleInference } = useInference();

  const handleInferenceRef =
    useRef<(inference: RhinoInference) => Promise<BotQA | string | null>>();

  const onSpeechStart = () => {
    setIsSpeechToText(true);
  };

  const onSpeechEnd = () => {
    setIsListening(false);
    setIsSpeechToText(false);
    picovoiceManager.current?.start();
  };

  const onSpeechError = (e: any) => {
    console.log('onSpeechError', e);
    setIsListening(false);
    setIsSpeechToText(false);
    picovoiceManager.current?.start();
  };

  const onSpeechResults = (e: any) => {
    console.log('onSpeechResults', e);
    if (e === undefined || e.value === undefined || e.value[0] === '') return;
    const botQA: BotQA = {
      question: e.value[0],
      answer: {
        question: e.value[0],
        type: fromVoiceBubbleType.current,
      },
    };
    addToHistory(botQA);
  };

  Voice.onSpeechStart = onSpeechStart;
  Voice.onSpeechEnd = onSpeechEnd;
  Voice.onSpeechError = onSpeechError;
  Voice.onSpeechResults = onSpeechResults;

  handleInferenceRef.current = handleInference;

  const switchToVTT = useCallback(() => {
    picovoiceManager.current?.stop();
    Voice.start('sv-SE');
  }, []);

  const wakeWordCallback = useCallback(() => {
    console.log('Wake word detected');
    setIsListening(true);
  }, []);

  const inferenceCallback = useCallback(
    async (inference: RhinoInference) => {
      setRhinoText(prettyPrint(inference));
      if (handleInferenceRef.current) {
        const botQA = await handleInferenceRef.current(inference);

        if (botQA !== null && typeof botQA === 'object') {
          addToHistory(botQA);
          setIsListening(false);
        } else if (typeof botQA === 'string') {
          fromVoiceBubbleType.current = botQA;
          switchToVTT();
        } else {
          console.log('Inference Text is null');
          setIsListening(false);
        }
      }
    },
    [addToHistory, switchToVTT],
  );

  useEffect(() => {
    (async () => {
      try {
        picovoiceManager.current = await PicovoiceManager.create(
          ACCESS_KEY,
          'wingler_en_android_v3_0_0.ppn',
          wakeWordCallback,
          'wingler_commands_en_android_v3_0_0.rhn',
          inferenceCallback,
          undefined,
          undefined,
          1,
        );
        if (picovoiceManager === undefined) {
          throw new Error('picovoiceManager is undefined');
        } else {
          await picovoiceManager.current.start();
          setContextInfo(picovoiceManager.current.contextInfo as string);
        }
      } catch (error) {
        console.error('error', error);
      }
    })();

    return () => {
      Voice.cancel();
      Voice.removeAllListeners();
      Voice.destroy();
      picovoiceManager?.current?.stop();
    };
  }, [wakeWordCallback, inferenceCallback]);

  if (!isListening) return null;

  return (
    <View className="absolute left-0 top-0 h-full w-full">
      <View className="flex-1 justify-center">
        <ListenerIndicator
          isListening={isListening}
          isSpeechToText={isSpeechToText}
          onPress={() => {
            AsyncStorage.removeItem('@History');
            clearHistory();
          }}
        />
      </View>

      <ContextInfo
        visible={false}
        rhinoText={rhinoText}
        contextInfo={contextInfo}
      />
    </View>
  );
};

export default Wingler;
