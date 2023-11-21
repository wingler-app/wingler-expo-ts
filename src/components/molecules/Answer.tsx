import BubbleText from '../atoms/BubbleText';
import BubbleWrap from '../atoms/BubbleWrap';

const Answer = ({ content }: { content: string }) => (
  <BubbleWrap type="answer">
    <BubbleText dark>{content}</BubbleText>
  </BubbleWrap>
);

export default Answer;
