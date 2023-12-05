import { Stack } from 'expo-router';

import SettingsTemplate from '@/components/templates/Settings';

const Settings = () => (
  <>
    <Stack.Screen
      options={{
        title: 'Settings',
      }}
    />
    {/* @ts-ignore */}
    <SettingsTemplate />
  </>
);

export default Settings;
