import { styled } from 'nativewind';
import { useState } from 'react';
import type { TextProps } from 'react-native';
import { Pressable, Text } from 'react-native';

type ButtonProps = {
  onPress: () => void;
  title: string;
  buttonStyle?: TextProps['style'];
  textStyle?: TextProps['style'];
  disabled?: boolean;
  type?: keyof typeof buttonTypeMap;
};

const buttonTypeMap = {
  default: {
    baseStyle: 'mb-6 rounded-full bg-accent px-4 py-2 w-auto self-center',
    pressedStyle: 'bg-accent-secondary',
    pressedTextStyle: '',
    disabledStyle: 'bg-gray-400',
    textStyle:
      'flex text-center font-bold tracking-widest text-white dark:text-black',
  },
  menu: {
    baseStyle:
      'flex px-6 py-4 bg-primary-dark border-2 border-primary-black mx-4 my-1 rounded-lg ',
    pressedStyle: 'bg-primary',
    pressedTextStyle: 'text-primary-black opacity-100',
    disabledStyle: 'bg-gray-400',
    textStyle: 'text-center tracking-widest text-white dark:text-primary',
  },
  list: {
    baseStyle: 'flex py-4 border-2 rounded-md border-primary-black mx-4 mb-2 ',
    pressedStyle: 'bg-primary-black',
    pressedTextStyle: '',
    disabledStyle: 'bg-gray-400',
    textStyle: 'px-4 tracking-widest text-white dark:text-secondary',
  },
};

function Button({
  onPress,
  title,
  buttonStyle,
  textStyle,
  disabled,
  type,
}: ButtonProps) {
  const [isPressed, setIsPressed] = useState<boolean>(false);

  const styles = buttonTypeMap[type || 'default'];
  if (!styles) throw new Error(`Button type ${type} not found`);

  const handleOnPress = () => {
    if (disabled) return;
    setIsPressed(false);
    onPress();
  };

  return (
    <Pressable
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={buttonStyle}
      className={`${styles.baseStyle} ${isPressed && styles.pressedStyle}
        ${disabled && styles.disabledStyle} ${buttonStyle}`}
      onPress={handleOnPress}
    >
      <Text
        style={textStyle}
        className={`${styles.textStyle} ${
          isPressed && styles.pressedTextStyle
        }`}
      >
        {title}
      </Text>
    </Pressable>
  );
}

export default styled(Button, {
  props: {
    buttonStyle: true,
    textStyle: true,
  },
});
