import * as Speech from 'expo-speech';
import { memo, useEffect } from 'react';

import usePlayback from '@/hooks/spotify/usePlayback';

import BubbleText from '../atoms/BubbleText';
import BubbleWrap from '../atoms/BubbleWrap';

interface PlaybackProps {
  content: { command: string };
}

const Playback = ({ content: { command } }: PlaybackProps) => {
  const { stop } = usePlayback();

  useEffect(() => {
    if (command === 'stop') {
      Speech.stop();
      stop();
    }
    console.log('effect is run');
  }, [command, stop]);

  console.log('stor render');
  return (
    <BubbleWrap type="answer">
      <BubbleText dark>Ok!</BubbleText>
    </BubbleWrap>
  );
};

export default memo(Playback);
