import { Image } from 'react-native';

import BubbleWrap from '../atoms/BubbleWrap';

interface ImageBubbleProps {
  content: string;
}

const ImageBubble = ({ content: uri }: ImageBubbleProps) => {
  return (
    <BubbleWrap padding="none" type="image">
      <Image source={{ uri }} width={300} height={200} />
    </BubbleWrap>
  );
};

export default ImageBubble;
