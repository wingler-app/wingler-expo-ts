import { PorcupineManager } from '@picovoice/porcupine-react-native';
import type { RhinoInference } from '@picovoice/rhino-react-native';
import { RhinoErrors, RhinoManager } from '@picovoice/rhino-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ExpoCrypto from 'expo-crypto';
import { Component } from 'react';
import {
  Image,
  Modal,
  PermissionsAndroid,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import type { StackParamList } from '../../types';
import InferenceHandler, {
  chatPrint,
  prettyPrint,
} from '../../utils/inference';

interface RhinoInferenceObject {
  inference: RhinoInference;
  id: string;
}

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
    InferenceHandler(inference);
    const obj: RhinoInferenceObject = {
      inference,
      id: ExpoCrypto.getRandomBytes(16).toString(),
    };

    this.setState((previousState) => ({
      rhinoText: prettyPrint(inference),
      buttonColor: 'border-4 border-transparent',
      buttonDisabled: false,
      isListening: false,
      history: [...previousState.history, obj],
    }));

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

  showContextInfo() {
    if (!this.state.isError) {
      this.setState({ showContextInfo: true });
    }
  }

  showInferenceInfo() {
    if (!this.state.isError) {
      this.setState({ showInferenceInfo: true });
    }
  }

  render() {
    return (
      <View className="flex-1">
        <View className="flex-1 justify-center bg-black">
          <View className="absolute top-10 w-full items-center justify-center">
            <TouchableOpacity
              className={`h-40 w-40 items-center justify-center ${
                this.state.isError ? 'bg-red-600' : ''
              } ${this.state.buttonColor} rounded-full`}
              onPress={() => this.startProcessing()}
              disabled={this.state.buttonDisabled || this.state.isError}
            >
              <Image className="h-[92] w-[100]" source={imageLogo} />
            </TouchableOpacity>
          </View>

          <Modal
            animationType="slide"
            transparent
            visible={this.state.showInferenceInfo}
          >
            <View className="m-10 mt-24 flex-1 rounded-lg bg-white p-4">
              <ScrollView className="mb-4 flex-[]">
                <Text className="text-black">{this.state.rhinoText}</Text>
              </ScrollView>
              <TouchableOpacity
                className="flex-[0.05] justify-center self-center bg-blue-700 p-1"
                onPress={() => this.setState({ showInferenceInfo: false })}
              >
                <Text className="text-white">CLOSE</Text>
              </TouchableOpacity>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            transparent
            visible={this.state.showContextInfo}
          >
            <View className="m-10 mt-24 flex-1 rounded-lg bg-white p-4">
              <ScrollView className="mb-4 flex-[]">
                <Text className="text-black">
                  {this.rhinoManager?.contextInfo}
                  {this.state.contextInfoText}
                </Text>
              </ScrollView>
              <TouchableOpacity
                className="flex-[0.05] justify-center self-center bg-blue-700 p-1"
                onPress={() => this.setState({ showContextInfo: false })}
              >
                <Text className="text-white">CLOSE</Text>
              </TouchableOpacity>
            </View>
          </Modal>

          {this.state.isError && (
            <View className="m-5 my-1 rounded-lg bg-red-500 p-4">
              <Text className="text-center text-xl text-white">
                {this.state.errorMessage}
              </Text>
            </View>
          )}

          <ScrollView className="top-32 flex-1">
            {this.state.history.map((item) => (
              <View className="m-4 flex-1" key={item.id}>
                <View className="h-14 w-14 rounded-full bg-white" />
                <View className="mx-14 flex-1 flex-row rounded rounded-tl-none bg-indigo-900 px-6 py-4">
                  <Text className="flex-wrap text-xl text-white">
                    {chatPrint(item.inference)}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
        <View className="flex-2 flex-row items-center justify-between bg-black">
          <Text className="ml-5 font-bold text-gray-700">
            wingler™ by Mektig
          </Text>
          <View className="m-2 flex-row">
            <TouchableOpacity
              className="mr-2 rounded-full bg-yellow-300"
              onPress={() => this.showContextInfo()}
            >
              <Text className="px-2  text-black">Context Info</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="rounded-full bg-yellow-300"
              onPress={() => this.showInferenceInfo()}
            >
              <Text className="px-2  text-black">Inference</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
