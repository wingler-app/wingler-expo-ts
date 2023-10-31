import * as Speech from 'expo-speech';

import { usePlayback } from '@/services/Spotify';

import BubbleText from '../atoms/BubbleText';
import BubbleWrap from '../atoms/BubbleWrap';

interface PlaybackProps {
  content: { command: string };
}

const Playback = ({ content: { command } }: PlaybackProps) => {
  const [, pause] = usePlayback();
  const playBack = (playback: string): void => {
    if (playback === 'stop') {
      Speech.stop();
      if (pause) pause();
    }
    console.log(playback);
  };

  playBack(command);

  return (
    <BubbleWrap type="answer">
      <BubbleText dark>Ok!</BubbleText>
    </BubbleWrap>
  );
};

export default Playback;
