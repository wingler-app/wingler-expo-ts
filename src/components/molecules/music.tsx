import { Image, Linking, Pressable, Text, View } from 'react-native';

type MusicProps = {
  content: {
    artist: string;
    albumCover: string;
    uri: string;
  };
};

const Music = ({ content: { artist, albumCover, uri } }: MusicProps) => {
  console.log('music render');
  const handleClick = () => {
    Linking.openURL(uri);
  };

  return (
    <View className=" flex flex-col">
      <Pressable className="my-2" onPress={handleClick}>
        <Image className="h-52 w-52" source={{ uri: albumCover }} />
      </Pressable>
      <Text className="flex-wrap text-xl text-primary-dark">{artist}</Text>
    </View>
  );
};

export default Music;
