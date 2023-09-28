import { Stack } from 'expo-router';

import RegisterTemplate from '@/components/templates/Register';

const Register = () => (
  <>
    <Stack.Screen
      options={{
        title: 'Register',
      }}
    />
    <RegisterTemplate />
  </>
);

export default Register;
