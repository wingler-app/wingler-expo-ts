import SpotifyLogo from 'assets/logos/spotify.svg';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, View } from 'react-native';

import usePlayback from '@/hooks/spotify/usePlayback';
import usePlaybackData from '@/hooks/spotify/usePlaybackData';

import Button from '../atoms/Button';
import { P } from '../atoms/Words';

const Player = () => {
  const { play, stop, next, prev } = usePlayback();
  const playbackData = usePlaybackData();

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

  return (
    <View className="absolute inset-x-0 top-8 z-40  w-full px-4 py-2">
      <View className="shadow-lg shadow-primary-black">
        <LinearGradient
          className="absolute left-0 top-0 z-10 h-full w-full rounded-xl"
          colors={playbackData.colors}
        />
        <View className="relative z-20 h-full w-full rounded-xl border-[1px] border-white/10  p-4 ">
          {/* <P
          size="2xs"
          className="absolute right-2 top-[2px] text-accent-secondary"
        >
          Playing on {playbackData?.device?.name}
        </P> */}
          <SpotifyLogo
            width="75"
            height="22.5"
            className="absolute bottom-[26px]  right-4"
          />
          <View className="flex flex-row">
            <Image
              className="mr-4"
              source={{ uri: playbackData?.item?.album?.images[0].url }}
              width={90}
              height={90}
            />
            <View className="">
              <P
                size="sm"
                className="-mt-1 mr-4 text-left text-white"
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
                  className="-ml-3 mb-0 mr-4"
                />
                <Button
                  icon={playbackData?.is_playing ? 'pause' : 'play'}
                  type="iconOnly"
                  onPress={handlePlayback}
                  className="mb-0 mr-3"
                  iconSize={40}
                />
                <Button
                  icon="play-skip-forward"
                  type="iconOnly"
                  onPress={playNext}
                  className="mb-0"
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Player;
