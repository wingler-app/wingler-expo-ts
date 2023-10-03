import { Stack } from 'expo-router';

import RegisterTemplate from '@/components/templates/Register';

const Register = () => (
  <>
    <Stack.Screen
      options={{
        title: 'Register',
        animationTypeForReplace: 'pop',
        animation: 'slide_from_bottom',
      }}
    />
    <RegisterTemplate />
  </>
);

export default Register;
