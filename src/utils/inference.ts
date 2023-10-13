import type { RhinoInference } from '@picovoice/rhino-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import * as Speech from 'expo-speech';

import type { BotQA } from '@/types';

export const speechOptions: Speech.SpeechOptions = {
  language: 'en-US',
  pitch: 1,
  rate: 0.75,
};

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

export const playMusic = async (musicGenre: string | undefined) => {
  if (!musicGenre) return 'Sorry, I could not find any music';
  const genreApiString = musicGenre.replace(' ', '%20');
  const API: string = 'https://api.spotify.com/v1/';

  const accessToken = await AsyncStorage.getItem('@SpotifyToken');
  // console.log(accessToken);
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
    // console.log(data.tracks.items[0].artists[0].name);
    // console.log(data.tracks.items[0].album.images[0].url);
    const answer = await {
      type: 'music',
      artist: data.tracks.items[0].artists[0].name,
      albumCover: data.tracks.items[0].album.images[0].url,
      uri: data.tracks.items[0].external_urls.spotify,
    };
    console.log('answermusic', answer);
    return answer;
    // Linking.openURL(data.tracks.items[0].external_urls.spotify);
    // playSound(data.tracks.items[0].preview_url);
  } catch (err) {
    console.log(err);
    return 'Sorry, I could not find any music';
  }
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

const InferenceHandler = async (
  inference: RhinoInference,
): Promise<false | null | BotQA> => {
  const { intent, slots, isUnderstood } = inference;
  const botQA: BotQA = {
    question: '',
    answer: '',
  };

  if (isUnderstood) {
    console.log(`Inference: ${intent}`);
    switch (intent) {
      case 'orderBeverage':
        if (slots?.beverage) {
          beverageHandler(slots.beverage);
          botQA.question = `Ordering ${slots.beverage}`;
          botQA.answer = "I'm on it!";
        }
        break;
      case 'playMusic':
        console.log('playMusic', slots?.musicGenre);
        try {
          const music = await playMusic(slots?.musicGenre);
          console.log('musicffs', music);
          botQA.question = `Play ${slots?.musicGenre}`;
          // botQA.answer = 'Setting the mood...';
          botQA.answer = music;
        } catch (e) {
          console.log(e);
        }
        break;
      case 'appCommands':
        if (slots?.locations) {
          goTo(slots.locations);
          botQA.question = `Go to ${slots.locations}`;
          botQA.answer = 'See you there!';
        }
        if (slots?.playback) {
          playBack(slots.playback);
          botQA.question = `${slots.playback}`;
          botQA.answer = 'Ok!';
          if (slots.playback === 'stop') Speech.stop();
        }
        break;
      case 'askQuestion':
        return false;
      default:
        console.log("Didn't understand the command");
        return null;
    }
  } else {
    console.log("Didn't understand the command");
    return null;
  }
  if (typeof botQA.answer === 'string') {
    setTimeout(() => Speech.speak(botQA.answer as string, speechOptions), 1000);
  }
  return botQA;
};

export const prettyPrint = (inference: RhinoInference): string =>
  JSON.stringify(inference, null, 4);

export default InferenceHandler;
