import type { NavigationProp } from '@react-navigation/native';

export type StackParamList = {
  Home: undefined;
  Settings: undefined;
  Wingler: undefined;
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
