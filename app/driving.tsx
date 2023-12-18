import { Stack } from 'expo-router';

import DrivingTemplate from '@/components/templates/DrivingTemplate';

const Driving = () => (
  <>
    <Stack.Screen
      options={{
        title: 'My driving',
        animationTypeForReplace: 'pop',
        animation: 'slide_from_bottom',
      }}
    />
    <DrivingTemplate />
  </>
);

export default Driving;
