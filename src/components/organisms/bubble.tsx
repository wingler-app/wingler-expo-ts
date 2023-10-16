import { Motion } from '@legendapp/motion';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

import Answer from '../molecules/answer';
import AskAI from '../molecules/askAI';
import Music from '../molecules/music';
import User from '../molecules/user';

console.log();
type BubbleProps = {
  type: string;
  content: object | string;
};

type BubbleMapping = {
  [key: string]: React.FC<any>;
};

type ColorMapping = {
  [key: string]: string;
};

const bubbleMapping: BubbleMapping = {
  user: User,
  answer: Answer,
  askAI: AskAI,
  music: Music,
};

const colorMapping: ColorMapping = {
  user: 'bg-primary',
  answer: 'bg-accent-secondary',
  askAI: 'bg-senary',
  music: 'bg-green-400',
  // music: 'bg-inc-spotify',
};

const Content = ({ content, type }: BubbleProps) => {
  const Component = bubbleMapping[type];

  if (!Component) return <Text>Unsupported type: {type}</Text>;
  return <Component content={content} />;
};

const Bubble = ({ content, type }: BubbleProps) => {
  let color = colorMapping[type];
  if (!color) color = colorMapping.user;

  return (
    <Motion.View
      className={`mx-4 flex-1 ${type === 'user' ? 'items-end' : 'items-start'}`}
      initial={{ y: 50, opacity: 0 }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      whileHover={{ scale: 1.2 }}
      whileTap={{ y: 20 }}
      transition={{ type: 'spring', damping: 20 }}
    >
      <LinearGradient
        colors={['#ffffff30', 'transparent', '#00000060']}
        className={`m-4 flex-1 flex-row rounded-xl shadow-lg shadow-primary-black ${color}
        ${type === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'}
        `}
      >
        <View
          className={`rounded-xl border-[1px] border-[#ffffff15] px-6 py-4
        ${type === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'}
        `}
        >
          <Content type={type} content={content} />
        </View>
      </LinearGradient>
    </Motion.View>
  );
};

export default Bubble;
