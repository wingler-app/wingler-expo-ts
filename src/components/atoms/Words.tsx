import type { StyleProp, TextStyle } from 'react-native';
import { Text } from 'react-native';

interface WordsProps {
  children: React.ReactNode;
  className?: string;
  style?: StyleProp<TextStyle>;
  dark?: boolean;
}

const H1 = ({ children, className, style, dark }: WordsProps) => {
  return (
    <Text
      style={style}
      className={`text-center text-4xl ${
        dark ? 'text-accent-secondary' : 'text-accent'
      } ${className}`}
    >
      {children}
    </Text>
  );
};

const P = ({ children, className, style, dark }: WordsProps) => {
  return (
    <Text
      style={style}
      className={` text-center text-xl ${dark && 'text-white'} ${className}`}
    >
      {children}
    </Text>
  );
};

export { H1, P };
