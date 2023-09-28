import { PicovoiceManager } from '@picovoice/picovoice-react-native';
import type { RhinoInference } from '@picovoice/rhino-react-native';
import * as ExpoCrypto from 'expo-crypto';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import type { BotQA, RhinoInferenceObject } from '@/types';
import InferenceHandler, { prettyPrint } from '@/utils/inference';

import Chat from '../organisms/chat';
import ContextInfo from '../organisms/contextInfo';
import ListenerIndicator from '../organisms/listenerIndicator';
import WingModal from '../organisms/modal';

const ACCESS_KEY: string =
  'J0P63/4nK6Qi5Griv0Lf0xzdFzcWlZ+wELe1/SX1vQ8FZszSi/5rrQ==';

const WinglerBot = () => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [history, setHistory] = useState<RhinoInferenceObject[]>([]);
  const [rhinoText, setRhinoText] = useState<string>('');
  const [showInference, setShowInference] = useState<boolean>(false);
  const [showContextInfo, setShowContextInfo] = useState<boolean>(false);
  const [contextInfo, setContextInfo] = useState<string>('');
  // const [picoVoice, setPicoVoice] = useState<PicovoiceManager | undefined>(
  //   undefined,
  // );

  const wakeWordCallback = () => {
    console.log('wingler');
    setIsListening(true);
  };

  const inferenceCallback = (inference: RhinoInference) => {
    setIsListening(false);
    setRhinoText(prettyPrint(inference));
    const botQA: null | BotQA = InferenceHandler(inference);
    if (botQA !== null) {
      const obj: RhinoInferenceObject = {
        botQA,
        id: ExpoCrypto.getRandomBytes(16).toString(),
      };
      setHistory((previousState) => [...previousState, obj]);
    } else {
      console.log('Inference Text is null');
    }
  };

  useEffect(() => {
    let picovoiceManager: PicovoiceManager | undefined;
    (async () => {
      try {
        picovoiceManager = await PicovoiceManager.create(
          ACCESS_KEY,
          'wingler_en_android_v2_2_0.ppn',
          wakeWordCallback,
          'wingler_commands_en_android_v2_2_0.rhn',
          inferenceCallback,
        );
        if (picovoiceManager === undefined) {
          throw new Error('picovoiceManager is undefined');
        } else {
          await picovoiceManager.start();
          setContextInfo(picovoiceManager.contextInfo as string);
          // setPicoVoice(picovoiceManager);
        }
      } catch (error) {
        console.error('error', error);
      }
    })();
    return () => {
      picovoiceManager?.stop();
    };
  }, []);

  return (
    <View className="flex-1">
      <View className="flex-1 justify-center bg-black">
        <ListenerIndicator
          buttonDisabled={isListening}
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
