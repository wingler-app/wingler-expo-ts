import { PicovoiceManager } from '@picovoice/picovoice-react-native';
import type { RhinoInference } from '@picovoice/rhino-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Voice from '@react-native-voice/voice';
import * as ExpoCrypto from 'expo-crypto';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

import type { BotQA, RhinoInferenceObject } from '@/types';
import InferenceHandler, { prettyPrint } from '@/utils/inference';

import Chat from '../organisms/Chat';
import ContextInfo from '../organisms/ContextInfo';
import DevHelper from '../organisms/DevHelper';
import ListenerIndicator from '../organisms/ListenerIndicator';

const ACCESS_KEY: string =
  'DL/kgn1cY69IfkfqQuomZtBsrFbnnSlXfjEKeunsnqHYb0gjgmJ7bw==';

const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@History');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    return [];
  }
};

const WinglerBot = () => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [history, setHistory] = useState<RhinoInferenceObject[]>([]);
  const [rhinoText, setRhinoText] = useState<string>('');
  const [contextInfo, setContextInfo] = useState<string>('');
  const [isSpeechToText, setIsSpeechToText] = useState<boolean>(false);

  const picovoiceManager = useRef<PicovoiceManager>();
  const fromVoiceBubbleType = useRef<string>('');

  const addToHistory = (botQA: BotQA) => {
    const obj: RhinoInferenceObject = {
      botQA,
      id: ExpoCrypto.getRandomBytes(16).toString(),
    };
    setHistory((previousState) => {
      AsyncStorage.setItem('@History', JSON.stringify([...previousState, obj]));
      return [...previousState, obj];
    });
  };

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
    if (e === undefined || e.value === undefined) return;
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

  useEffect(() => {
    const switchToVTT = () => {
      picovoiceManager.current?.stop();
      Voice.start('sv-SE');
    };

    const inferenceCallback = async (inference: RhinoInference) => {
      setRhinoText(prettyPrint(inference));

      const botQA = await InferenceHandler(inference);

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
    };

    const wakeWordCallback = () => {
      console.log('Wake word detected');
      setIsListening(true);
    };

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
  }, []);

  useEffect(() => {
    getData().then((data) => {
      if (data !== null) setHistory(data);
    });
  }, []);

  return (
    <View className="flex-1">
      <View className="flex-1 justify-center bg-primary-dark">
        <ListenerIndicator
          isListening={isListening}
          isSpeechToText={isSpeechToText}
          onPress={() => {
            AsyncStorage.removeItem('@History');
            setHistory([]);
          }}
        />

        <Chat history={history} />
        <DevHelper />
      </View>

      <ContextInfo
        visible={false}
        rhinoText={rhinoText}
        contextInfo={contextInfo}
      />
    </View>
  );
};

export default WinglerBot;
