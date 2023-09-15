import { Stack } from 'expo-router';

import WinglerBot from '@/components/templates/WinglerBot';

const Wingler = () => (
  <>
    <Stack.Screen
      options={{
        title: 'Wingler bot',
      }}
    />
    {/* <WinglerBot navigation={undefined} route={undefined} /> */}
    {/* @ts-ignore */}
    <WinglerBot />
  </>
);

export default Wingler;
