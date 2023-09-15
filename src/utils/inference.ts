import type { RhinoInference } from '@picovoice/rhino-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Linking } from 'react-native';

import { promptOpenAI } from './handleQuestion';

export const beverageHandler = (beverage: string): void => {
  switch (beverage) {
    case 'coffee':
      console.log('Going to Settings');
      router.push('settings');
      break;
    case 'espresso':
      console.log('Going to Home');
      router.push('wingler');
      break;
    default:
      console.log('default');
      break;
  }
};

export const playMusic = (musicGenre: string | undefined): void => {
  if (!musicGenre) return;
  const genreApiString = musicGenre.replace(' ', '%20');
  const API: string = 'https://api.spotify.com/v1/';

  (async () => {
    const accessToken = await AsyncStorage.getItem('@SpotifyToken');
    console.log(accessToken);
    try {
      const response = await fetch(
        `${API}search?q=genre%22${genreApiString}%22&type=track`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const data = await response.json();
      // console.log(data.tracks.items[0].uri);
      Linking.openURL(data.tracks.items[0].external_urls.spotify);
      // playSound(data.tracks.items[0].preview_url);
    } catch (err) {
      console.log(err);
    }
  })();
};

const goTo = (location: string): void => {
  switch (location) {
    case 'home':
      console.log('Going to Home');
      router.push('/');
      break;
    case 'settings':
      console.log('Going to Settings');
      router.push('settings');
      break;
    case 'chat':
      console.log('Going to Chat');
      router.push('wingler');
      break;
    default:
      console.log('default');
      break;
  }
};

const playBack = (playback: string): void => {
  console.log(playback);
};

const InferenceHandler = (inference: RhinoInference): void => {
  const { intent, slots, isUnderstood } = inference;

  if (isUnderstood) {
    console.log(`Inference: ${intent}`);
    switch (intent) {
      case 'orderBeverage':
        if (slots?.beverage) {
          beverageHandler(slots.beverage);
        }
        break;
      case 'playMusic':
        console.log('playMusic', slots?.musicGenre);
        playMusic(slots?.musicGenre);
        break;
      case 'appCommands':
        if (slots?.locations) goTo(slots.locations);
        if (slots?.playback) playBack(slots.playback);
        break;
      case 'askQuestion':
        // if (typeof slots?.question === 'string') {
        promptOpenAI('What is the meaning of life?');
        // } else {
        //   console.log('No question found');
        // }
        break;
      default:
        console.log("Didn't understand the command");
        break;
    }
  } else {
    console.log("Didn't understand the command");
  }
};

export default InferenceHandler;

export const prettyPrint = (inference: RhinoInference): string =>
  JSON.stringify(inference, null, 4);

export const chatPrint = (inference: RhinoInference): string => {
  let chatText = (inference.isUnderstood ? '✅ ' : '❌ ') + inference.intent;
  if (inference.isUnderstood && inference.slots) {
    chatText += ' ';
    const slots = Object.values(inference.slots);
    slots.forEach((slot: string) => {
      chatText += `${slot}=... `;
    });
    // chatText += `${slotName}=${inference.slots[slotName]} `;
    chatText += '';
  }
  return chatText;
};
