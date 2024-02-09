import { useEffect, useState } from 'react';
import { View } from 'react-native';

import usePlayback from '@/hooks/spotify/usePlayback';

import Button from '../atoms/Button';

const Player = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [url, setUrl] = useState<string>('');
  const { play, stop } = usePlayback();

  const handlePlayback = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (stop) stop();
    } else {
      setIsPlaying(true);
      if (play) play(url);
    }
  };

  useEffect(() => {
    (async () => {
      setIsVisible(!isVisible);
      setUrl('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
    })();
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <View className="absolute inset-x-0 top-8 z-40 h-32 w-full p-6">
      <View className="flex h-full w-full flex-row items-center justify-center rounded-xl border-[1px] border-white/10 bg-primary-dark shadow-lg shadow-primary-black">
        <Button
          icon="play-skip-back"
          type="iconOnly"
          onPress={handlePlayback}
          className="mb-0"
        />
        <Button
          icon={isPlaying ? 'pause' : 'play'}
          type="iconOnly"
          onPress={handlePlayback}
          className="mb-0"
          iconSize={40}
        />
        <Button
          icon="play-skip-forward"
          type="iconOnly"
          onPress={handlePlayback}
          className="mb-0"
        />
      </View>
    </View>
  );
};

export default Player;
