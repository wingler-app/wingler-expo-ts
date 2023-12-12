import { Motion } from '@legendapp/motion';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { View } from 'react-native';

import Button from '../atoms/Button';

interface SliderMenuProps {
  children: React.ReactNode;
  backButton?: string;
}

const SliderMenu = ({ children, backButton }: SliderMenuProps) => {
  const [menu, setMenu] = useState<boolean>(true);
  const [menuHeight, setMenuHeight] = useState<number>(0);

  const menuRef = useRef<View | null>(null);

  return (
    <Motion.View
      ref={menuRef}
      onLayout={() => {
        menuRef.current?.measure((x, y, width, height, pageX, pageY) => {
          console.log('measurements', x, y, width, height, pageX, pageY);
          setMenuHeight(height - 75);
        });
      }}
      className="absolute bottom-0 w-full"
      initial={{ y: 0 }}
      animate={{ y: menu ? 0 : menuHeight }}
      transition={{ type: 'spring', damping: 20 }}
    >
      <View className="rounded-t-3xl bg-primary-dark p-4 shadow-lg shadow-primary-black">
        <View className="flex flex-row">
          <View className="flex basis-3/4">
            {backButton && (
              <Button
                icon="arrow-back"
                buttonStyle="self-start"
                title={backButton}
                onPress={() => router.back()}
              />
            )}
          </View>
          <View className=" flex basis-1/4">
            <Button
              icon={menu ? 'chevron-down' : 'chevron-up'}
              type="minimal"
              buttonStyle="self-end"
              onPress={() => setMenu((prev) => !prev)}
            />
          </View>
        </View>
        {children}
      </View>
    </Motion.View>
  );
};

export default SliderMenu;
