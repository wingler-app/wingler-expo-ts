import { PorcupineManager } from '@picovoice/porcupine-react-native';
import type { RhinoInference } from '@picovoice/rhino-react-native';
import { RhinoErrors, RhinoManager } from '@picovoice/rhino-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ExpoCrypto from 'expo-crypto';
import { Component } from 'react';
import { PermissionsAndroid, Platform, Text, View } from 'react-native';

import type { BotQA, RhinoInferenceObject, StackParamList } from '../../types';
import InferenceHandler, { prettyPrint } from '../../utils/inference';
import Chat from '../organisms/chat';
import ContextInfo from '../organisms/contextInfo';
import ListenerIndicator from '../organisms/listenerIndicator';
import WingModal from '../organisms/modal';

const imageLogo = require('../../../assets/logo.png');

const ACCESS_KEY: string =
  'J0P63/4nK6Qi5Griv0Lf0xzdFzcWlZ+wELe1/SX1vQ8FZszSi/5rrQ==';

type Props = NativeStackScreenProps<StackParamList, 'Wingler'>;
type State = {
  buttonColor: string;
  buttonDisabled: boolean;
  rhinoText: string;
  isListening: boolean;
  isError: boolean;
  errorMessage: string;
  showContextInfo: boolean;
  showInferenceInfo: boolean;
  contextInfoText: string;
  history: RhinoInferenceObject[];
};

export default class WinglerBot extends Component<Props, State> {
  rhinoManager: RhinoManager | undefined;

  porcupineManager: PorcupineManager | undefined;

  constructor(props: any) {
    super(props);
    this.state = {
      buttonColor: 'border-4 border-transparent',
      buttonDisabled: false,
      rhinoText: '',
      isListening: false,
      isError: false,
      errorMessage: '',
      showContextInfo: false,
      showInferenceInfo: false,
      contextInfoText: '',
      history: [],
    };
  }

  async componentDidMount() {
    this.porcupineManager = await PorcupineManager.fromKeywordPaths(
      ACCESS_KEY,
      ['wingler_en_android_v2_2_0.ppn'],
      this.detectionCallback,
      undefined,
      undefined,
      [1],
    );
    await this.porcupineManager.start();
  }

  componentWillUnmount() {
    this.rhinoManager?.delete();
    this.porcupineManager?.delete();
  }

  detectionCallback = (keywordIndex: number) => {
    const contextPath = 'wingler_commands_en_android_v2_2_0.rhn';

    if (keywordIndex === 0) {
      console.log('wingler');
      this.porcupineManager?.stop();
      this.startProcessing();
      this.createRhinoManager(contextPath);
    } else if (keywordIndex === 1) {
      console.log('bumblebee');
    }
  };

  createRhinoManager = async (contextPath: string): Promise<void> => {
    try {
      this.rhinoManager = await RhinoManager.create(
        ACCESS_KEY,
        contextPath,
        this.inferenceCallback.bind(this),
        (error) => {
          this.errorCallback(error.message);
        },
      );
      if (this.rhinoManager?.contextInfo)
        this.setState({ contextInfoText: this.rhinoManager.contextInfo });
    } catch (err: any) {
      let errorMessage;
      if (err instanceof RhinoErrors.RhinoInvalidArgumentError) {
        errorMessage = `${err.message}\nPlease make sure your accessKey '${ACCESS_KEY}'' is a valid access key.`;
      } else if (err instanceof RhinoErrors.RhinoActivationError) {
        errorMessage = 'AccessKey activation error';
      } else if (err instanceof RhinoErrors.RhinoActivationLimitError) {
        errorMessage = 'AccessKey reached its device limit';
      } else if (err instanceof RhinoErrors.RhinoActivationRefusedError) {
        errorMessage = 'AccessKey refused';
      } else if (err instanceof RhinoErrors.RhinoActivationThrottledError) {
        errorMessage = 'AccessKey has been throttled';
      } else {
        errorMessage = err.toString();
      }
      this.errorCallback(errorMessage);
    }
  };

  errorCallback(error: string) {
    this.setState({
      isError: true,
      errorMessage: error,
    });
  }

  async inferenceCallback(inference: RhinoInference) {
    const botQA: null | BotQA = await InferenceHandler(inference);
    if (botQA !== null) {
      const obj: RhinoInferenceObject = {
        botQA,
        id: ExpoCrypto.getRandomBytes(16).toString(),
      };

      this.setState((previousState) => ({
        rhinoText: prettyPrint(inference),
        buttonColor: 'border-4 border-transparent',
        buttonDisabled: false,
        isListening: false,
        history: [...previousState.history, obj],
      }));
    } else {
      console.log('Inference Text is null');
      this.setState((previousState) => ({
        rhinoText: prettyPrint(inference),
        buttonColor: 'border-4 border-transparent',
        buttonDisabled: false,
        isListening: false,
        history: [...previousState.history],
      }));
    }
    await this.rhinoManager?.delete();
    this.porcupineManager?.start();
  }

  async startProcessing() {
    if (this.state.isListening) {
      return;
    }

    this.setState({
      buttonDisabled: true,
    });

    let recordAudioRequest;
    if (Platform.OS === 'android') {
      recordAudioRequest = this.requestRecordAudioPermission();
    } else {
      recordAudioRequest = new Promise(function (resolve, _) {
        resolve(true);
      });
    }

    recordAudioRequest.then((hasPermission) => {
      if (!hasPermission) {
        console.error('Required microphone permission was not granted.');
        return;
      }
      if (this.rhinoManager === undefined) {
        console.error('RhinoManager failed to initialize.');
        return;
      }

      this.rhinoManager.process().then(() => {
        this.setState({
          buttonColor: ' bg-teal-900',
          rhinoText: '',
          buttonDisabled: false,
          isListening: true,
        });
      });
    });
  }

  async requestRecordAudioPermission() {
    try {
      const permission = PermissionsAndroid.PERMISSIONS.RECORD_AUDIO;
      if (!permission) {
        throw new Error('Permission not defined');
      }
      const granted = await PermissionsAndroid.request(permission, {
        title: 'Microphone Permission',
        message:
          'wingler™ needs access to your microphone to make intent inferences.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      });
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err: any) {
      this.errorCallback(err.toString());
      return false;
    }
  }

  showContextInfo(mode: boolean) {
    console.log('showContextInfo');
    if (!this.state.isError) this.setState({ showContextInfo: mode });
  }

  showInferenceInfo(mode: boolean) {
    if (!this.state.isError) this.setState({ showInferenceInfo: mode });
  }

  render() {
    return (
      <View className="flex-1">
        <View className="flex-1 justify-center bg-black">
          <ListenerIndicator
            isError={this.state.isError}
            buttonColor={this.state.buttonColor}
            buttonDisabled={this.state.buttonDisabled}
            imageLogo={imageLogo}
            onPress={() => this.startProcessing()}
          />
          <WingModal
            info={this.state.rhinoText}
            visible={this.state.showInferenceInfo}
            onClose={() => this.showInferenceInfo(false)}
          />
          <WingModal
            info={
              this.rhinoManager?.contextInfo
                ? this.rhinoManager?.contextInfo
                : `${this.state.contextInfoText}`
            }
            visible={this.state.showContextInfo}
            onClose={() => this.showContextInfo(false)}
          />

          {this.state.isError && (
            <View className="m-5 my-1 rounded-lg bg-red-500 p-4">
              <Text className="text-center text-xl text-white">
                {this.state.errorMessage}
              </Text>
            </View>
          )}
          <Chat history={this.state.history} />
        </View>
        <ContextInfo
          showContextInfo={() => this.showContextInfo(true)}
          showInferenceInfo={() => this.showInferenceInfo(true)}
        />
      </View>
    );
  }
}
