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
import ListenerIndicator from '../organisms/ListenerIndicator';
import WingModal from '../organisms/Modal';

const ACCESS_KEY: string =
  'cxPKsYiXYjyiBNITmZniwbKNu5lqYDTRU+qeciOjaqWMC+AhY25qzQ==';

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
  const [showInference, setShowInference] = useState<boolean>(false);
  const [showContextInfo, setShowContextInfo] = useState<boolean>(false);
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
    setIsListening(true);
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
      setIsListening(false);
      setRhinoText(prettyPrint(inference));

      const botQA = await InferenceHandler(inference);

      if (botQA !== null && typeof botQA === 'object') {
        addToHistory(botQA);
      } else if (typeof botQA === 'string') {
        fromVoiceBubbleType.current = botQA;
        switchToVTT();
      } else {
        console.log('Inference Text is null');
      }
    };

    const wakeWordCallback = () => setIsListening(true);

    (async () => {
      try {
        picovoiceManager.current = await PicovoiceManager.create(
          ACCESS_KEY,
          'wingler_en_android_v2_2_0.ppn',
          wakeWordCallback,
          'wingler_commands_en_android_v2_2_0.rhn',
          inferenceCallback,
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
      if (data !== null) {
        setHistory(data);
      }
    });
  }, []);

  return (
    <View className="flex-1">
      <View className="flex-1 justify-center bg-primary-dark">
        <ListenerIndicator
          buttonDisabled={isListening}
          isSpeechToText={isSpeechToText}
          onPress={() => AsyncStorage.removeItem('@History')}
        />
        <WingModal
          info={rhinoText}
          visible={showInference}
          onClose={() => setShowInference(false)}
        />
        <WingModal
          info={contextInfo}
          visible={showContextInfo}
          onClose={() => setShowContextInfo(false)}
        />
        <Chat history={history} />
      </View>

      <ContextInfo
        showContextInfo={() => setShowContextInfo(true)}
        showInferenceInfo={() => setShowInference(true)}
      />
    </View>
  );
};

export default WinglerBot;
