import BubbleText from '../atoms/BubbleText';
import BubbleWrap from '../atoms/BubbleWrap';

const User = ({ content }: { content: string }) => (
  <BubbleWrap type="user">
    <BubbleText dark>{content}</BubbleText>
  </BubbleWrap>
);

export default User;