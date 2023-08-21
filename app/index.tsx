import { Stack } from 'expo-router';

import { Welcome } from '@/components/templates/Welcome';

const Home = () => (
  <>
    <Stack.Screen
      options={{
        title: 'My home',
      }}
    />
    <Welcome />
  </>
);

export default Home;
