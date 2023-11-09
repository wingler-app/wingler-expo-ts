import { memo } from 'react';
import { Image, Linking, Pressable, Text } from 'react-native';

import useArtist from '@/hooks/spotify/useArtist';

import BubbleText from '../atoms/BubbleText';

interface ArtistProps {
  name: string;
  id: string;
}

const Artist = ({ name, id }: ArtistProps) => {
  const { answer, loading, error } = useArtist(id);

  if (loading) return <Text>...</Text>;
  if (error) return <Text>Something went wrong, {error.message}</Text>;

  const { uri, avatar } = answer;

  return (
    <Pressable
      className="flex flex-row items-center"
      onPress={() => Linking.openURL(uri)}
    >
      <Image className="mr-2 h-10 w-10 rounded-full" source={{ uri: avatar }} />
      <BubbleText textStyle="text-sm">{name}</BubbleText>
    </Pressable>
  );
};

export default memo(Artist);
