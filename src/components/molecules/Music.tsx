import { useEffect } from 'react';
import { Image, Pressable, View } from 'react-native';

import { useGenre, usePlayback } from '@/services/Spotify';

import BubbleText from '../atoms/BubbleText';
import BubbleWrap from '../atoms/BubbleWrap';
import Artist from './Artist';

interface MusicProps {
  content: {
    params: string;
  };
}

const Music = ({ content: { params } }: MusicProps) => {
  const { answer, loading, error } = useGenre(params);
  const { play } = usePlayback();

  useEffect(() => {
    if (answer && play && !loading && !error) play(answer.uri);
  }, [answer, play, loading, error]);

  if (loading)
    return (
      <BubbleWrap type="default">
        <BubbleText dark>Setting the mood...</BubbleText>
      </BubbleWrap>
    );

  if (error)
    return (
      <BubbleWrap type="default">
        <BubbleText dark>
          Something didn&apos;t sit right.. {error.message}
        </BubbleText>
      </BubbleWrap>
    );

  const { uri, name, albumCover, artist, colors } = answer;
  // if (play) play(uri);
  const handleClick = () => {
    if (play) play(uri);
  };

  return (
    <BubbleWrap type="music" colors={colors} padding="even">
      <View className="flex max-w-[240] flex-col">
        <Pressable
          className="h-60 w-60 shadow-md shadow-primary-black"
          onPress={handleClick}
        >
          <Image className="h-full w-full" source={{ uri: albumCover }} />
        </Pressable>
        <BubbleText textStyle="my-4">{name}</BubbleText>
        <Artist id={artist.id} name={artist.name} />
      </View>
    </BubbleWrap>
  );
};

export default Music;
