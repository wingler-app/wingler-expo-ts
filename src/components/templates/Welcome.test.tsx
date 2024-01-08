import { render, screen, waitFor } from '@testing-library/react-native';

import { Welcome } from './Welcome';

jest.mock('@react-native-firebase/auth', () => {
  return () => ({
    onAuthStateChanged: jest.fn(),
  });
});

describe('Welcome', () => {
  it('should render the default text', async () => {
    render(<Welcome />);
    const text = screen.queryByText(/Calling/);
    await waitFor(() => expect(text).toBeVisible());
  });
});
