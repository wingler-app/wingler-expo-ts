import { Motion } from '@legendapp/motion';
import SpotifyLogo from 'assets/logos/spotify.svg';
import SpotifyIcon from 'assets/logos/spotify-icon.svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState } from 'react';
import { Image, View } from 'react-native';

import usePlayback from '@/hooks/spotify/usePlayback';
import usePlaybackData from '@/hooks/spotify/usePlaybackData';

import Button from '../atoms/Button';
import { P } from '../atoms/Words';

const Player = () => {
  const { play, stop, next, prev } = usePlayback();
  const playbackData = usePlaybackData();

  const playerRef = useRef<View | null>(null);
  const [visible, setVisible] = useState(true);
  const [playerWidth, setPlayerWidth] = useState<number>(0);
  const handlePlayback = () => {
    if (playbackData) {
      if (playbackData.is_playing) {
        stop();
      } else {
        play();
      }
    }
  };

  const playNext = () => {
    next();
  };

  const playPrevious = () => {
    prev();
  };

  if (!playbackData) return null;

  const progress =
    ((playbackData?.progress_ms ?? 0) /
      (playbackData?.item?.duration_ms ?? 1)) *
    100;
  return (
    <Motion.View
      ref={playerRef}
      onLayout={() => {
        playerRef.current?.measure((x, y, width, height, pageX, pageY) => {
          console.log('measurements', x, y, width, height, pageX, pageY);
          setPlayerWidth(width);
        });
      }}
      className="absolute inset-x-0 top-8 z-40 w-full px-4 py-2"
      initial={{ x: 0, opacity: 0 }}
      animate={{ x: visible ? 0 : playerWidth, opacity: 1 }}
      transition={{ type: 'spring', damping: 20 }}
    >
      <View className="shadow-lg shadow-primary-black">
        <LinearGradient
          className="absolute left-0 top-0 z-10 h-full w-full rounded-xl"
          colors={playbackData.colors}
        />
        <View className="absolute inset-x-0 bottom-0 z-30 h-10 w-full justify-end overflow-hidden rounded-b-xl ">
          <View
            className="h-1 bg-inc-spotify"
            style={{ width: `${progress}%` }}
          />
        </View>
        <View className="relative z-20 h-full w-full rounded-xl border-[1px] border-white/10  p-4 ">
          {/* <P
          size="2xs"
          className="absolute right-2 top-[2px] text-accent-secondary"
        >
          Playing on {playbackData?.device?.name}
        </P> */}
          <SpotifyIcon
            width="40"
            height="40"
            className="absolute left-[-81px] z-40"
            onPress={() => setVisible(true)}
          />
          <Button
            buttonStyle="absolute bottom-[-65px]  z-20 right-[-10px]"
            icon="md-arrow-forward-circle"
            type="iconOnly"
            onPress={() => setVisible(false)}
          />
          <SpotifyLogo
            width="75"
            height="22.5"
            className="absolute bottom-[26px]  right-4"
          />
          <View className="flex flex-row">
            {playbackData?.item && (
              <Image
                className="absolute top-0"
                source={{ uri: playbackData?.item?.album?.images[0]?.url }}
                width={90}
                height={90}
              />
            )}
            <View className="w-full pl-[110px]">
              <P
                size="sm"
                className="-mt-1 w-full text-left text-white"
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  textShadowColor: 'rgba(0, 0, 0, .1)',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 1,
                }}
              >
                {playbackData?.item?.name}
              </P>
              <P
                className="mb-1 text-left text-xs text-white/70"
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  textShadowColor: 'rgba(0, 0, 0, .1)',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 1,
                }}
              >
                {playbackData?.item?.artists[0].name}
              </P>
              <View className="flex w-full flex-row items-center">
                <Button
                  icon="play-skip-back"
                  type="iconOnly"
                  onPress={playPrevious}
                  className={`-ml-3 mb-0 mr-4 ${
                    playbackData?.actions?.disallows?.skipping_prev &&
                    'opacity-20'
                  }`}
                />
                <Button
                  icon={playbackData?.is_playing ? 'pause' : 'play'}
                  type="iconOnly"
                  onPress={handlePlayback}
                  className="mb-0 mr-3"
                  iconSize={45}
                />
                <Button
                  icon="play-skip-forward"
                  type="iconOnly"
                  onPress={playNext}
                  className={`mb-0 ${
                    playbackData?.actions?.disallows?.skipping_next &&
                    'opacity-20'
                  }`}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Motion.View>
  );
};

export default Player;
