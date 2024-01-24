import { render, waitFor } from '@testing-library/react-native';

import Logo from '../molecules/Logo';
import { Welcome } from './Welcome';

jest.mock('@react-native-firebase/auth', () => {
  return () => ({
    onAuthStateChanged: jest.fn(),
  });
});

jest.mock('../molecules/Logo', () => jest.fn(() => null));

describe('Welcome', () => {
  it('should render the default text', async () => {
    render(<Welcome />);
    await waitFor(() => expect(Logo).toHaveBeenCalled());
  });
});
