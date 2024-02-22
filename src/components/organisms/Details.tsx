import { Ionicons } from '@expo/vector-icons';
import { memo, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { Linking, ScrollView, View } from 'react-native';

import { useAskSummary } from '@/services/CloudFunctions';
import type { PlaceDetails } from '@/types/maps';

// @ts-ignore
import * as Colors from '../../styles/colors';
import Button from '../atoms/Button';
import { H, P } from '../atoms/Words';
import PhotoReference from '../molecules/PhotoReference';
import Review from '../molecules/Review';

interface DetailsProps {
  details: PlaceDetails;
}

const Details = ({
  details: {
    photos,
    opening_hours,
    reviews,
    rating,
    name,
    website,
    formatted_phone_number,
  },
}: DetailsProps) => {
  const question = reviews?.map((review) => review.text).join(' ');
  const [width, setWidth] = useState<number | null>(null);
  const [answer] = useAskSummary(question || '');
  // const [answer, loading] = useAskAi(question || '');

  const handleLayout = (e: LayoutChangeEvent) => {
    console.log(e.nativeEvent.layout);
    setWidth(e.nativeEvent.layout.width);
  };

  return (
    <>
      <P
        size="sm"
        className={`absolute right-4 top-5 font-bold ${
          opening_hours?.open_now ? 'text-green-400' : 'text-red-600'
        }`}
      >
        {opening_hours?.open_now ? 'OPEN' : 'CLOSED'}
      </P>
      <View onLayout={handleLayout}>
        {photos && width && (
          <ScrollView horizontal className="mb-5 flex w-full flex-row">
            {photos.map((photo) => {
              const key = `${photo?.photo_reference}-${photo?.width}`;
              return (
                <PhotoReference
                  key={key}
                  reference={photo?.photo_reference}
                  height={width * 0.75}
                  width={width}
                />
              );
            })}
          </ScrollView>
        )}
        <View className="mb-8">
          <H size="3xl" className="px-4" numberOfLines={2} adjustsFontSizeToFit>
            {name}
          </H>

          {rating && (
            <View className="mt-6 px-4">
              <View className="flex flex-row justify-center">
                {[...Array(Math.floor(rating))].map((_, i) => {
                  const key = `${name}-${i}`;
                  return (
                    <Ionicons
                      key={key}
                      style={{ marginRight: 1 }}
                      name="star"
                      size={30}
                      color={Colors.accent.DEFAULT}
                    />
                  );
                })}
                {[...Array(5 - Math.floor(rating))].map((_, i) => {
                  const key = `${name}-${i}`;
                  return (
                    <Ionicons
                      key={key}
                      style={{ marginRight: 1 }}
                      name="star-outline"
                      size={30}
                      color={Colors.accent.DEFAULT}
                    />
                  );
                })}
              </View>
            </View>
          )}
          {(formatted_phone_number || website) && (
            <View className="mt-6 flex flex-row justify-center gap-x-2 px-4">
              {formatted_phone_number && (
                <Button
                  icon="call"
                  title="Call"
                  onPress={() =>
                    Linking.openURL(`tel:${formatted_phone_number}`)
                  }
                />
              )}
              {website && (
                <Button
                  icon="globe"
                  title="Website"
                  onPress={() => Linking.openURL(website)}
                />
              )}
            </View>
          )}
        </View>
        {opening_hours?.weekday_text && (
          <View className="mb-10 px-4">
            <H dark size="sm" className="text-left uppercase">
              Opening Hours
            </H>
            {opening_hours?.weekday_text.map((day, i) => {
              const key = `${day}-${i}`;
              return (
                <P key={key} dark size="sm" className="text-left">
                  {day}
                </P>
              );
            })}
          </View>
        )}
        <H dark size="sm" className="px-4 text-left uppercase">
          Reviews
        </H>
        <Review
          review={{
            author_name: 'wingler AI',
            text: answer || "Loading AI's answer...",
          }}
        />
        {reviews?.map((review) => {
          const key = `${review?.author_name}-${review?.time}`;
          return <Review key={key} review={review} />;
        })}
      </View>
    </>
  );
};
export default memo(Details);
