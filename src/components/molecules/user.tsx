import BubbleText from '../atoms/bubbleText';

const User = ({ content }: { content: string }) => (
  <BubbleText>{content}</BubbleText>
);

export default User;
