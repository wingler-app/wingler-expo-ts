import { Ionicons } from '@expo/vector-icons';
import { Image, View } from 'react-native';

// @ts-ignore
import * as Colors from '../../styles/colors';
import { P } from '../atoms/Words';
import Logo from './Logo';

interface ReviewProps {
  review: {
    author_name: string;
    profile_photo_url?: string;
    rating?: number | null;
    text: string;
    time?: number;
  };
}

const Review = ({ review }: ReviewProps) => {
  return (
    <View className="my-4 px-4">
      <View className="mb-4 flex flex-row">
        {review?.profile_photo_url && (
          <Image
            height={45}
            width={45}
            source={{ uri: review?.profile_photo_url }}
          />
        )}
        {review?.author_name === 'wingler AI' && (
          <View className="rounded-full bg-gray-800 ">
            <Logo logoStyles="w-[45px] h-[45]" />
          </View>
        )}
        <View className="ml-2 flex flex-col">
          <P dark size="sm" className="text-left">
            {review?.author_name}
          </P>
          {review?.rating && (
            <View className="flex flex-row">
              {[...Array(review?.rating)].map((_, i) => {
                const starKey = `${review?.author_name}-${review?.time}-${i}`;
                return (
                  <Ionicons
                    key={starKey}
                    style={{ marginRight: 1 }}
                    name="star"
                    size={20}
                    color={Colors.accent.DEFAULT}
                  />
                );
              })}
            </View>
          )}
        </View>
      </View>
      <P dark size="sm" className="text-left">
        {review?.text}
      </P>
    </View>
  );
};

export default Review;
