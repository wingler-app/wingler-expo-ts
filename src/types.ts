import type { NavigationProp } from '@react-navigation/native';

export type StackParamList = {
  welcome: undefined;
  settings: undefined;
  chat: undefined;
};

export type StackNavigation = NavigationProp<StackParamList>;

export interface RhinoInferenceObject {
  botQA: BotQA;
  id: string;
}

export interface BotQA {
  question: string;
  answer: string;
}
