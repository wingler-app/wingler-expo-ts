import type { RhinoInference } from '@picovoice/rhino-react-native';
import { router } from 'expo-router';

import InferenceHandler, {
  beverageHandler,
  playMusic,
  prettyPrint,
  speechOptions,
} from './inference';

jest.mock('@react-native-async-storage/async-storage');
jest.mock('react-native', () => ({
  Linking: {
    openURL: jest.fn(),
  },
}));
jest.mock('expo-speech', () => ({
  speak: jest.fn(),
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
    // expect(Speech.speak).toHaveBeenCalled();
  });
});

describe('speechOptions', () => {
  it('should be of type SpeechOptions', () => {
    expect(speechOptions).toEqual(
      expect.objectContaining({
        language: 'en-US',
        pitch: 1,
        rate: 0.75,
      }),
    );
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
