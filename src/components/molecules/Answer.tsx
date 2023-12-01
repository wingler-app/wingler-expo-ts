import { Text } from 'react-native';

import BubbleText from '../atoms/BubbleText';
import BubbleWrap from '../atoms/BubbleWrap';

type ParsedContent = {
  text: string;
  style: string;
  id: string;
};

const parseContent = (content: string) => {
  const parsedContent: Array<ParsedContent> = [];
  const segments = content.split(/(\*\*.*?\*\*|\*.*?\*|\[.*?\].*?\[\])/g);

  segments.forEach((segment, index) => {
    const id = index.toString();
    let style = '';
    let text = segment;
    if (/\*\*(.*?)\*\*/.test(segment)) {
      style = 'font-bold';
      text = segment.slice(2, -2);
    } else if (/\*(.*?)\*/.test(segment)) {
      style = 'font-italic';
      text = segment.slice(1, -1);
    } else if (/\[(.*?)\](.*?)\[\]/.test(segment)) {
      const match = /\[(.*?)\](.*?)\[\]/.exec(segment);
      if (match) {
        style = match[1] ? match[1] : '';
        text = match[2] ? match[2] : '';
      }
    }
    parsedContent.push({ text, style, id });
  });

  return parsedContent;
};

const Answer = ({ content }: { content: string }) => {
  const parsedContent = parseContent(content);

  return (
    <BubbleWrap type="answer">
      <BubbleText>
        {parsedContent.map((item) => (
          <Text key={item.id} className={item.style}>
            {item.text}
          </Text>
        ))}
      </BubbleText>
    </BubbleWrap>
  );
};

export default Answer;
