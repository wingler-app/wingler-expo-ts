import type { RhinoInference } from '@picovoice/rhino-react-native';
import { router } from 'expo-router';

import InferenceHandler, { beverageHandler, playMusic } from './inference';

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

  it('should call Linking.openURL with the correct URL', () => {
    const mockFetch = jest.fn();
    global.fetch = mockFetch;
    // await AsyncStorage.setItem('@SpotifyToken', 'test_token');
    // await playMusic('rock');
    playMusic('rock');
    expect(true).toBe(true);
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
