import { Stack } from 'expo-router';

import Wingler from '@/components/organisms/Wingler';

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
