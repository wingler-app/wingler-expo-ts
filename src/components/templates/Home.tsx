import { View } from 'react-native';

import Chat from '../organisms/Chat';
import DevHelper from '../organisms/DevHelper';

const HomeTemplate = () => {
  return (
    <View className="flex-1 justify-center bg-primary-dark">
      <Chat />
      <DevHelper />
    </View>
  );
};

export default HomeTemplate;
