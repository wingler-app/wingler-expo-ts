import { Text } from 'react-native';

const Answer = ({ content }: { content: string }) => {
  return <Text className="flex-wrap text-xl text-primary-dark">{content}</Text>;
};
export default Answer;
