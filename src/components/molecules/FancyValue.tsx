import { styled } from 'nativewind';
import type { TextProps } from 'react-native';
import { Text, View } from 'react-native';

interface FancyValueProps {
  title: string;
  value: string | number;
  type?: keyof typeof typeToSuffix;
  style?: object;
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
      <Text style={textStyle} className="text-xl text-white">
        {formatValue()}
      </Text>
    </View>
  );
};

export default styled(FancyValue, {
  props: {
    className: true,
    textStyle: true,
  },
});
