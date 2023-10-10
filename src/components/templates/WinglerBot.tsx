import { PicovoiceManager } from '@picovoice/picovoice-react-native';
import type { RhinoInference } from '@picovoice/rhino-react-native';
import Voice from '@react-native-voice/voice';
import * as ExpoCrypto from 'expo-crypto';
import * as Speech from 'expo-speech';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

import type { RhinoInferenceObject } from '@/types';
import { promptOpenAI } from '@/utils/handleQuestion';
import InferenceHandler, {
  prettyPrint,
  speechOptions,
} from '@/utils/inference';

import Chat from '../organisms/chat';
import ContextInfo from '../organisms/contextInfo';
import ListenerIndicator from '../organisms/listenerIndicator';
import WingModal from '../organisms/modal';

const ACCESS_KEY: string =
  'cxPKsYiXYjyiBNITmZniwbKNu5lqYDTRU+qeciOjaqWMC+AhY25qzQ==';

const WinglerBot = () => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [history, setHistory] = useState<RhinoInferenceObject[]>([]);
  const [rhinoText, setRhinoText] = useState<string>('');
  const [showInference, setShowInference] = useState<boolean>(false);
  const [showContextInfo, setShowContextInfo] = useState<boolean>(false);
  const [contextInfo, setContextInfo] = useState<string>('');
  const [isSpeechToText, setIsSpeechToText] = useState<boolean>(false);

  const picovoiceManager = useRef<PicovoiceManager>();

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
    console.log('onSpeechResults', e);
    if (e === undefined || e.value === undefined) return;
    console.log(e.value[0]);
    (async () => {
      if (e.value !== undefined) {
        const last = e.value[0] as string;
        const answer = await promptOpenAI(last);
        Speech.speak(answer, speechOptions);
      }
    })();
  };
  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;

    const textToSpeech = async () => {
      Voice.start('en-US');
    };

    const killPicoVoice = () => {
      picovoiceManager.current?.stop();
      textToSpeech();
    };

    const inferenceCallback = async (inference: RhinoInference) => {
      setIsListening(false);
      setRhinoText(prettyPrint(inference));

      const botQA = await InferenceHandler(inference);

      if (botQA !== null && botQA !== false) {
        const obj: RhinoInferenceObject = {
          botQA,
          id: ExpoCrypto.getRandomBytes(16).toString(),
        };
        setHistory((previousState) => [...previousState, obj]);
      } else if (botQA === false) {
        killPicoVoice();
      } else {
        console.log('Inference Text is null');
      }
    };

    const wakeWordCallback = () => {
      console.log('wingler');
      setIsListening(true);
    };

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

  return (
    <View className="flex-1">
      <View className="flex-1 justify-center bg-primary-dark">
        <ListenerIndicator
          buttonDisabled={isListening}
          isSpeechToText={isSpeechToText}
          onPress={() => console.log('pressed')}
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
