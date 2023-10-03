import { Stack } from 'expo-router';

import LoginTemplate from '@/components/templates/Login';

const Login = () => (
  <>
    <Stack.Screen
      options={{
        title: 'Login',
      }}
    />
    <LoginTemplate />
  </>
);

export default Login;
