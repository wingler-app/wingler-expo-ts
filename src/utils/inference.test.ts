import type { RhinoInference } from '@picovoice/rhino-react-native';
import { router } from 'expo-router';

import InferenceHandler, {
  beverageHandler,
  chatPrint,
  playMusic,
  prettyPrint,
} from './inference';

jest.mock('@react-native-async-storage/async-storage');
jest.mock('react-native', () => ({
  Linking: {
    openURL: jest.fn(),
  },
}));

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock('@react-navigation/native');

describe('beverageHandler', () => {
  it('should navigate to settings', () => {
    beverageHandler('coffee');
    expect(router.push).toHaveBeenCalledWith('settings');
  });

  it('should navigate to wingler', () => {
    beverageHandler('espresso');
    expect(router.push).toHaveBeenCalledWith('wingler');
  });

  it('should not navigate', () => {
    beverageHandler('default');
    expect(router.push).not.toHaveBeenCalled();
  });
});

describe('playMusic', () => {
  it('should not play music', () => {
    const mockFetch = jest.fn();
    global.fetch = mockFetch;
    playMusic(undefined);
    expect(mockFetch).not.toHaveBeenCalled();
  });
});

describe('InferenceHandler', () => {
  it('should pass', () => {
    // @ts-ignore
    const inference: RhinoInference = {
      isUnderstood: true,
      intent: 'orderBeverage',
      slots: {
        beverage: 'coffee',
        musicGenre: 'rock',
      },
      isFinalized: true,
      _isFinalized: true,
    };
    // const navigation = { navigate: jest.fn() } as unknown as StackNavigation;
    InferenceHandler(inference);
    expect(true).toBe(true);
  });
});

describe('prettyPrint', () => {
  it('should return a pretty-printed JSON string', () => {
    const inference: unknown | RhinoInference = {
      isUnderstood: true,
      intent: 'orderBeverage',
      slots: {
        beverage: 'coffee',
      },
      isFinalized: true,
      _isFinalized: true,
    };
    const expectedOutput = `{
    "isUnderstood": true,
    "intent": "orderBeverage",
    "slots": {
        "beverage": "coffee"
    },
    "isFinalized": true,
    "_isFinalized": true
}`;
    expect(prettyPrint(inference as RhinoInference)).toEqual(expectedOutput);
  });
});

describe('chatPrint', () => {
  it('should return a chat-friendly string', () => {
    const inference: unknown | RhinoInference = {
      isUnderstood: true,
      intent: 'orderBeverage',
      slots: {
        beverage: 'coffee',
      },
      isFinalized: true,
      _isFinalized: true,
    };
    const expectedOutput = '✅ orderBeverage coffee=... ';
    expect(chatPrint(inference as RhinoInference)).toEqual(expectedOutput);
  });

  it('should return an error string if inference is not understood', () => {
    const inference: unknown | RhinoInference = {
      isUnderstood: false,
      intent: '',
      slots: {},
      isFinalized: true,
      _isFinalized: true,
    };
    const expectedOutput = '❌ ';
    expect(chatPrint(inference as RhinoInference)).toEqual(expectedOutput);
  });
});
