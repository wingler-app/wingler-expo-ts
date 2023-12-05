import { Text, View } from 'react-native';

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
    let style = 'text-xl text-white flex flex-wrap self-wrap ';
    let text = segment;
    if (/\*\*(.*?)\*\*/.test(segment)) {
      style += 'font-bold';
      text = segment.slice(2, -2);
    } else if (/\*(.*?)\*/.test(segment)) {
      style += 'font-italic';
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
      <View className="flex-1 flex-row flex-wrap items-baseline">
        {parsedContent.map((item) => (
          <Text
            style={{
              textShadowColor: 'rgba(0, 0, 0, .1)',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 1,
            }}
            key={item.id}
            className={item.style}
          >
            {item.text}
          </Text>
        ))}
      </View>
    </BubbleWrap>
  );
};

export default Answer;
