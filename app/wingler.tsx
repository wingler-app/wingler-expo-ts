import { Stack } from 'expo-router';

import { WinglerBot } from '@/components/templates/WinglerBot';

const Wingler = () => (
  <>
    <Stack.Screen
      options={{
        title: 'Wingler bot',
      }}
    />
    <WinglerBot />
  </>
);

export default Wingler;
