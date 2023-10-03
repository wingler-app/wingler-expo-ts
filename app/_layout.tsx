import { Stack } from 'expo-router';
import * as SystemUI from 'expo-system-ui';

SystemUI.setBackgroundColorAsync('#151523');
export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    />
  );
}
