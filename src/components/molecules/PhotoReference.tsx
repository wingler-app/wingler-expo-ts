import { GOOGLE_MAPS_API_KEY } from '@env';
import { memo } from 'react';
import type { ImageProps } from 'react-native';
import { Image } from 'react-native';

const baseUrl = 'https://maps.googleapis.com/maps/api/place/photo';
const maxwidth = 400;

interface PhotoReferenceProps extends Omit<ImageProps, 'source'> {
  reference: string;
}

const PhotoReference = ({ reference, ...rest }: PhotoReferenceProps) => {
  const photoUrl = `${baseUrl}?maxwidth=${maxwidth}&photoreference=${reference}&key=${GOOGLE_MAPS_API_KEY}`;

  console.log('photoUrl', photoUrl);
  return <Image source={{ uri: photoUrl }} {...rest} />;
};

export default memo(PhotoReference);
