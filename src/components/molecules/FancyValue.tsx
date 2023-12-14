import { styled } from 'nativewind';
import type { StyleProp, TextProps, ViewStyle } from 'react-native';
import { Text, View } from 'react-native';

import { P } from '../atoms/Words';

interface FancyValueProps {
  title: string;
  value: string | number;
  type?: keyof typeof typeToSuffix;
  style?: StyleProp<ViewStyle>;
  className?: TextProps['style'];
  textStyle?: TextProps['style'];
}

const typeToSuffix = {
  none: '',
  distance: 'km',
  duration: 'min',
  currency: 'kr',
};

const FancyValue = ({
  title,
  value,
  type,
  style,
  className,
  textStyle,
}: FancyValueProps) => {
  const formatValue = () => {
    const suffix = typeToSuffix[type || 'none'];
    return `${value} ${suffix}`;
  };

  return (
    <View style={[style, className]} className="items-center">
      <Text
        className="font-bold uppercase tracking-wider text-accent"
        style={textStyle}
      >
        {title}
      </Text>
      <P dark style={textStyle}>
        {formatValue()}
      </P>
    </View>
  );
};

export default styled(FancyValue, {
  props: {
    className: true,
    textStyle: true,
  },
});
