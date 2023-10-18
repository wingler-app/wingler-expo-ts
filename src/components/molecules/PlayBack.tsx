import * as Speech from 'expo-speech';

import BubbleText from '../atoms/BubbleText';
import BubbleWrap from '../atoms/BubbleWrap';

interface PlaybackProps {
  content: { command: string };
}

const playBack = (playback: string): void => {
  if (playback === 'stop') Speech.stop();
  console.log(playback);
};

const Playback = ({ content: { command } }: PlaybackProps) => {
  playBack(command);
  return (
    <BubbleWrap type="answer">
      <BubbleText dark>Ok!</BubbleText>
    </BubbleWrap>
  );
};

export default Playback;
