import { Motion } from '@legendapp/motion';
import { Text, View } from 'react-native';

import Answer from '../molecules/answer';
import AskAI from '../molecules/askAI';
import Music from '../molecules/music';
import User from '../molecules/user';

type BubbleProps = {
  type: string;
  content: object | string;
};

type BubbleMapping = {
  [key: string]: React.FC<any>;
};

const bubbleMapping: BubbleMapping = {
  user: User,
  answer: Answer,
  askAI: AskAI,
  music: Music,
};

const Content = ({ content, type }: BubbleProps) => {
  const Component = bubbleMapping[type];

  if (!Component) return <Text>Unsupported type: {type}</Text>;
  return <Component content={content} />;
};

const Bubble = ({ content, type }: BubbleProps) => {
  return (
    <Motion.View
      className={`mx-4 flex-1 ${type === 'user' ? 'items-end' : 'items-start'}`}
      initial={{ y: -50, opacity: 0 }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      whileHover={{ scale: 1.2 }}
      whileTap={{ y: 20 }}
      transition={{ type: 'spring', damping: 20 }}
    >
      <View
        className={`m-4 flex-1 flex-row rounded-xl  px-6 py-4
        ${type === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'}
        ${type === 'user' && 'bg-primary'}
        ${type === 'answer' && 'bg-accent-secondary'}
        ${type === 'askAI' && 'bg-gray-400'}
        ${type === 'music' && 'bg-[#1DB954]'}
        `}
      >
        <Content type={type} content={content} />
      </View>
    </Motion.View>
  );
};

export default Bubble;
