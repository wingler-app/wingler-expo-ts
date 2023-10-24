import type { TextProps } from 'react-native';
import { Text } from 'react-native';

interface BubbleTextProps {
  children: TextProps['children'];
  dark?: boolean;
  textStyle?: string;
}

const BubbleText = ({ children, dark, textStyle }: BubbleTextProps) => (
  <Text
    style={{
      textShadowColor: dark ? 'rgba(255,255,255,.2)' : 'rgba(0, 0, 0, .1)',
      textShadowOffset: dark
        ? { width: -1, height: -1 }
        : { width: 1, height: 1 },
      textShadowRadius: 1,
    }}
    className={`flex-wrap text-xl
      ${textStyle}
    ${dark ? 'text-black' : 'text-white'}`}
  >
    {children}
  </Text>
);

export default BubbleText;
