import BubbleText from '../atoms/bubbleText';

const Answer = ({ content }: { content: string }) => (
  <BubbleText dark>{content}</BubbleText>
);

export default Answer;
