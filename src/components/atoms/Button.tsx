import { Ionicons } from '@expo/vector-icons';
import { styled } from 'nativewind';
import { useState } from 'react';
import type { StyleProp, TextProps, ViewStyle } from 'react-native';
import { Pressable, Text } from 'react-native';

interface CommonProps {
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
  buttonStyle?: TextProps['style'];
  textStyle?: TextProps['style'];
  disabled?: boolean;
  type?: keyof typeof buttonTypeMap;
  iconAfter?: boolean;
  active?: boolean;
  iconSize?: number;
}

export interface IconProps extends CommonProps {
  icon: keyof typeof Ionicons.glyphMap;
}

interface TitleProps extends CommonProps {
  title: string;
}

type ButtonProps = IconProps | TitleProps;

const buttonTypeMap = {
  default: {
    baseStyle:
      'flex flex-row mb-6 rounded-full bg-accent px-4 py-2 w-auto self-center',
    pressedStyle: 'bg-accent-secondary',
    pressedTextStyle: '',
    disabledStyle: 'bg-gray-400',
    textStyle:
      'flex text-center font-bold tracking-widest text-white dark:text-black',
  },
  menu: {
    baseStyle:
      'flex flex-row px-6 py-4 bg-primary-dark border-2 border-primary-black mx-4 my-1 rounded-lg ',
    pressedStyle: 'bg-primary',
    pressedTextStyle: 'text-primary-black opacity-100',
    disabledStyle: 'bg-gray-400',
    textStyle: 'text-center tracking-widest text-white dark:text-primary',
  },
  list: {
    baseStyle:
      'flex flex-row py-4 border-2 rounded-md border-primary-black mx-4 mb-2 ',
    pressedStyle: 'bg-primary-black',
    pressedTextStyle: '',
    disabledStyle: 'bg-gray-400',
    textStyle: 'px-4 tracking-widest text-white dark:text-secondary',
  },
  minimal: {
    baseStyle:
      'flex mb-6 rounded-full px-[10] border-[1px] border-[#ffffff50] bg-[#ffffff50] flex-row py-2 w-auto',
    pressedStyle: 'bg-white text-black',
    pressedTextStyle: '',
    disabledStyle: '',
    textStyle: 'text-center tracking-widest text-white',
  },
  iconOnly: {
    baseStyle: 'flex mb-6 px-[10] flex-row  w-auto',
    pressedStyle: '',
    pressedTextStyle: '',
    disabledStyle: '',
    textStyle: 'text-center tracking-widest text-white',
  },
  slider: {
    baseStyle:
      'flex p-1 flex-col items-center rounded-md w-auto self-center border-[1px] border-white',
    pressedStyle: 'bg-accent-secondary border-transparent',
    pressedTextStyle: 'text-white dark:text-primary-dark',
    disabledStyle: 'bg-gray-400',
    textStyle:
      'text-[10px] font-bold flex text-center uppercase mt-2 text-primary-dark dark:text-white',
  },
};

function Button({
  style,
  onPress,
  buttonStyle,
  textStyle,
  disabled,
  type,
  iconAfter,
  active,
  iconSize,
  ...rest
}: ButtonProps) {
  const { icon, title } = rest as IconProps & TitleProps;

  const [isPressed, setIsPressed] = useState<boolean>(false);

  const styles = buttonTypeMap[type || 'default'];
  if (!styles) throw new Error(`Button type ${type} not found`);

  const handleOnPress = () => {
    if (disabled) return;
    setIsPressed(false);
    onPress();
  };

  const handleIconColor = () => {
    if (type === 'iconOnly') return 'white';
    if (type !== 'slider' && type !== 'minimal') return 'black';
    return isPressed || active ? 'black' : 'white';
  };

  const handleIconSize = () => {
    if (!iconSize) return type === 'slider' ? 32 : 26;
    return iconSize;
  };

  return (
    <Pressable
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={[buttonStyle, style]}
      className={`${styles.baseStyle}
        ${isPressed && styles.pressedStyle}
        ${active && styles.pressedStyle}
        ${disabled && styles.disabledStyle}
        ${buttonStyle}
      `}
      onPress={handleOnPress}
    >
      {icon && !iconAfter && (
        <Ionicons
          className=""
          name={icon}
          size={handleIconSize()}
          color={handleIconColor()}
        />
      )}
      <Text
        style={textStyle}
        className={`${styles.textStyle}
        ${isPressed && styles.pressedTextStyle}
        ${active && styles.pressedTextStyle}
        ${icon && !iconAfter && title && 'ml-2'}
        ${icon && iconAfter && title && 'mr-2'}
        ${type === 'slider' && 'mr-2'}
        `}
      >
        {title && title}
      </Text>
      {icon && iconAfter && <Ionicons name={icon} size={24} color="black" />}
    </Pressable>
  );
}

export default styled(Button, {
  props: {
    buttonStyle: true,
    textStyle: true,
  },
});
