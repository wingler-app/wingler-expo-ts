import { styled } from 'nativewind';
import { useState } from 'react';
import type { TextProps } from 'react-native';
import { Pressable, Text, View } from 'react-native';

type ButtonProps = {
  onPress: () => void;
  title: string;
  buttonStyle?: TextProps['style'];
  disabled?: boolean;
};

function Button({ onPress, title, buttonStyle, disabled }: ButtonProps) {
  const [isPressed, setIsPressed] = useState<boolean>(false);

  const handleOnPress = () => {
    if (disabled) return;
    setIsPressed(false);
    onPress();
  };

  return (
    <View>
      <Pressable
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        style={buttonStyle}
        className={`mb-6 rounded-full bg-accent px-6 py-4 ${
          isPressed && 'bg-accent-secondary'
        }
        ${disabled && 'bg-gray-400'} ${buttonStyle}`}
        onPress={handleOnPress}
      >
        <Text className="text-center font-bold uppercase tracking-widest text-white dark:text-black">
          {title}
        </Text>
      </Pressable>
    </View>
  );
}

export default styled(Button, {
  props: {
    buttonStyle: true,
  },
});
