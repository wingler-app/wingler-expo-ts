import type { StyleProp, TextProps, TextStyle } from 'react-native';
import { Text } from 'react-native';

interface WordsProps extends TextProps {
  children: React.ReactNode;
  className?: string;
  style?: StyleProp<TextStyle>;
  dark?: boolean;
  size?: keyof typeof sizeMap;
  rest?: any;
}

const sizeMap = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-md',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
};

const H = ({ children, className, style, dark, size, ...rest }: WordsProps) => {
  const sizeClass = size ? sizeMap[size] : 'text-4xl';

  return (
    <Text
      style={style}
      className={`text-center ${sizeClass} ${
        dark ? 'text-accent-secondary' : 'text-accent'
      } ${className}`}
      {...rest}
    >
      {children}
    </Text>
  );
};

const P = ({ children, className, style, dark, size, ...rest }: WordsProps) => {
  const sizeClass = size ? sizeMap[size] : 'text-xl';

  return (
    <Text
      style={style}
      className={` text-center ${sizeClass} ${
        dark && 'text-white'
      } ${className}`}
      {...rest}
    >
      {children}
    </Text>
  );
};

export { H, P };
