import type { RhinoInference } from '@picovoice/rhino-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Linking } from 'react-native';

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
      console.log(data);
      // console.log(data.tracks.items[0].uri);
      Linking.openURL(data.tracks.items[0].external_urls.spotify);
      // playSound(data.tracks.items[0].preview_url);
    } catch (err) {
      console.log(err);
    }
  })();
};

// const playSound = async (preview_url: string): Promise<void> => {
//   console.log(preview_url);
//   try {
//     const { sound } = await Audio.Sound.createAsync(
//       { uri: preview_url },
//       { shouldPlay: true, isLooping: false },
//       onPlaybackStatusUpdate,
//     );
//     await sound.playAsync();
//   } catch (e) {
//     console.log(e);
//   }
// };

// const onPlaybackStatusUpdate = async (status: any): Promise<void> => {
//   console.log(status);
// };

const InferenceHandler = (
  inference: RhinoInference,
  // navigation: StackNavigation,
): void => {
  // const navigation = useNavigation<StackNavigation>();
  // console.log('navigation', navigation);
  if (inference.isUnderstood) {
    console.log(`Inference: ${inference.intent}`);
    switch (inference.intent) {
      case 'orderBeverage':
        if (inference.slots?.beverage) {
          beverageHandler(inference.slots.beverage);
        }
        break;
      case 'playMusic':
        console.log('playMusic', inference.slots?.musicGenre);
        playMusic(inference.slots?.musicGenre);
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
