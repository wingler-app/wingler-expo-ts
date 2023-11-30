import { Stack } from 'expo-router';
import * as SystemUI from 'expo-system-ui';

import Wingler from '@/components/organisms/Wingler';

SystemUI.setBackgroundColorAsync('#151523');
export default function Layout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      />
      <Wingler />
    </>
  );
}
