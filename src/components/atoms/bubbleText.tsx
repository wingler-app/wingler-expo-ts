import { Text } from 'react-native';

interface BubbleTextProps {
  children: string;
  dark?: boolean;
}

const BubbleText = ({ children, dark }: BubbleTextProps) => (
  <Text
    style={{
      textShadowColor: dark ? 'rgba(255,255,255,.2)' : 'rgba(0, 0, 0, .1)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 1,
    }}
    className={`flex-wrap text-xl
    ${dark ? 'text-black' : 'text-white'}`}
  >
    {children}
  </Text>
);

export default BubbleText;
