import { Stack } from 'expo-router';

import SettingsTemplate from '@/components/templates/Settings';

const Settings = () => (
  <>
    <Stack.Screen
      options={{
        title: 'Wingler bot',
      }}
    />
    {/* @ts-ignore */}
    <SettingsTemplate />
  </>
);

export default Settings;
