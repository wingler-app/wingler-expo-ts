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
  done?: boolean;
  question: string;
  answer: string | any;
}

export type Position = {
  latitude: number;
  longitude: number;
  latitudeDelta?: number;
  longitudeDelta?: number;
};
