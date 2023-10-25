import AsyncStorage from '@react-native-async-storage/async-storage';
import { memo, useEffect, useState } from 'react';
import { Image, Linking, Pressable, Text, View } from 'react-native';
import { getColors } from 'react-native-image-colors';
import type { AndroidImageColors } from 'react-native-image-colors/build/types';

import BubbleText from '../atoms/BubbleText';
import BubbleWrap from '../atoms/BubbleWrap';

const API: string = 'https://api.spotify.com/v1/';

type Track = {
  uri: string;
  name: string;
  albumCover: string;
  artist: ArtistProps;
};

interface ArtistProps {
  name: string;
  id: string;
}

interface MusicProps {
  content: {
    params: string;
  };
}

export const getArtist = async (artistId: string): Promise<any | string> => {
  const accessToken = await AsyncStorage.getItem('@SpotifyToken');

  try {
    const response = await fetch(`${API}artists/${artistId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (e) {
    console.log(e);
    return 'Sorry, I could not find any music';
  }
};

export const getMusic = async (
  musicGenre: string | undefined,
): Promise<Track | string> => {
  if (!musicGenre) return 'Sorry, I could not find any music';

  const genreApiString = musicGenre.replace(' ', '%20');
  const accessToken = await AsyncStorage.getItem('@SpotifyToken');

  try {
    const response = await fetch(
      `${API}search?q=genre%3A${genreApiString}&type=track`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const data = await response.json();
    const answer = await {
      uri: data.tracks.items[0].external_urls.spotify,
      name: data.tracks.items[0].name,
      albumCover: data.tracks.items[0].album.images[0].url,
      artist: {
        name: data.tracks.items[0].artists[0].name,
        id: data.tracks.items[0].artists[0].id,
      },
    };

    return answer;
  } catch (e) {
    console.log(e);
    return 'Sorry, I could not find any music';
  }
};

const Artist = memo(({ name, id }: ArtistProps) => {
  const [avatar, setAvatar] = useState<null | string>(null);
  const [uri, setUri] = useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        const artist = await getArtist(id);
        setAvatar(artist.images[0].url);
        setUri(artist.uri);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [id]);

  if (!avatar) return <Text>...</Text>;

  return (
    <Pressable
      className="flex flex-row items-center"
      onPress={() => Linking.openURL(uri)}
    >
      <Image className="mr-2 h-10 w-10 rounded-full" source={{ uri: avatar }} />
      <BubbleText textStyle="text-sm">{name}</BubbleText>
    </Pressable>
  );
});

const Music = ({ content: { params } }: MusicProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [uri, setUri] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [albumCover, setAlbumCover] = useState<string>('');
  const [artistName, setArtistName] = useState<string>('');
  const [artistId, setArtistId] = useState<string>('');
  const [colors, setColors] = useState<string[]>(['#000000', '#000000']);

  useEffect(() => {
    (async () => {
      try {
        const track: Track | string = await getMusic(params);
        if (typeof track !== 'string') {
          setUri(track.uri);
          setName(track.name);
          setAlbumCover(track.albumCover);
          setArtistName(track.artist.name);
          setArtistId(track.artist.id);
          try {
            const { average, darkMuted } = (await getColors(
              track.albumCover,
            )) as AndroidImageColors;
            setColors([average, darkMuted]);
            setLoading(false);
          } catch (e) {
            console.log(e);
            setLoading(false);
          }
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, [params]);

  const handleClick = () => {
    Linking.openURL(uri);
  };

  if (loading)
    return (
      <BubbleWrap type="default">
        <BubbleText dark>Setting the mood...</BubbleText>
      </BubbleWrap>
    );

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
        <Artist id={artistId} name={artistName} />
      </View>
    </BubbleWrap>
  );
};

export default Music;
