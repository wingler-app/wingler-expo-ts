import { Text } from 'react-native';

const User = ({ content }: { content: string }) => {
  return <Text className="flex-wrap text-xl text-white">{content}</Text>;
};
export default User;
