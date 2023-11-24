import { useEffect } from 'react';
import { Image, Pressable, View } from 'react-native';

import usePlayback from '@/hooks/spotify/usePlayback';
import useSpotifySearch from '@/hooks/spotify/useSpotifySearch';
import useHistoryStore from '@/store/useHistoryStore';
import type { BotQA } from '@/types';
import type { Track } from '@/types/spotify';

import BubbleText from '../atoms/BubbleText';
import BubbleWrap from '../atoms/BubbleWrap';
import Artist from './Artist';

interface MusicProps {
  id: string;
  content: {
    params?: string;
    question?: string;
    track?: Track;
  };
  type: string;
}

const MusicBubble = ({ track }: { track: Track }) => {
  const { uri, name, albumCover, artist, colors } = track;
  const { play } = usePlayback();

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

const MusicGenerator = ({
  content: { params, question },
  type,
  id,
}: MusicProps): JSX.Element | null => {
  console.log('MusicGenerator', params, question);
  const { answer, loading, error } = useSpotifySearch({
    genre: params !== undefined ? params : question || '',
    type,
  });
  const { play } = usePlayback();
  const { changeById } = useHistoryStore();

  useEffect(() => {
    if (answer) {
      console.log('got answer', answer);
      play(answer.uri);
      const botQA: BotQA = {
        done: true,
        question: question || `Play ${params}`,
        answer: {
          track: answer,
          type,
        },
      };
      changeById(id, botQA);
    }
  }, [answer, changeById, id, params, play, question, type]);

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

  return null;
};

const Music = ({ content, id, type }: MusicProps) => {
  if (content && content.track) return <MusicBubble track={content.track} />;
  return <MusicGenerator id={id} type={type} content={content} />;
};

export default Music;
