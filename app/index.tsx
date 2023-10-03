import { Stack } from 'expo-router';

import { Welcome } from '@/components/templates/Welcome';

const Home = () => (
  <>
    <Stack.Screen
      options={{
        title: 'My home',
        animationTypeForReplace: 'pop',
        animation: 'slide_from_bottom',
      }}
    />
    <Welcome />
  </>
);

export default Home;
