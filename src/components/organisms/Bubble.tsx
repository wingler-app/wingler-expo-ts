import { Motion } from '@legendapp/motion';
import { Text } from 'react-native';

import Answer from '../molecules/Answer';
import AskAI from '../molecules/AskAI';
import Help from '../molecules/Help';
import ImageBubble from '../molecules/Image';
import Maps from '../molecules/Maps';
import Music from '../molecules/Music';
import Playback from '../molecules/PlayBack';
import User from '../molecules/User';

type BubbleProps = {
  id?: string;
  visible?: boolean;
  type: keyof typeof bubbleMapping;
  content: object | string;
};

type BubbleMapping = {
  [key: string]: React.FC<any>;
};

const bubbleMapping: BubbleMapping = {
  answer: Answer,
  askAI: AskAI,
  maps: Maps,
  music: Music,
  musicartist: Music,
  musicalbum: Music,
  musicsong: Music,
  musicplaylist: Music,
  playback: Playback,
  user: User,
  help: Help,
  image: ImageBubble,
};

const Content = ({ id, visible, content, type }: BubbleProps) => {
  const Component = bubbleMapping[type];

  if (!Component) return <Text>Unsupported type: {type}</Text>;
  return <Component id={id} type={type} content={content} visible={visible} />;
};

const Bubble = ({ id, visible, content, type }: BubbleProps) => (
  <Motion.View
    className={`mx-2 flex-1 ${type === 'user' ? 'items-end' : 'items-start'}`}
    initial={{ y: 50, opacity: 0 }}
    animate={{
      y: 0,
      opacity: 1,
    }}
    whileHover={{ scale: 1.2 }}
    whileTap={{ y: 20 }}
    transition={{ type: 'spring', damping: 20 }}
  >
    <Content id={id} type={type} content={content} visible={visible} />
  </Motion.View>
);

export default Bubble;
