import { Link } from 'expo-router';
import { Text, View } from 'react-native';

const Welcome = () => (
  <View className="flex-1 items-center justify-center">
    <Text>Hello World!</Text>
    <Link href="/wingler">Wingler</Link>
  </View>
);

export { Welcome };
