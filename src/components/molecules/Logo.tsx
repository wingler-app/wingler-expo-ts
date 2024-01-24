import { styled } from 'nativewind';
import type { ViewStyle } from 'react-native';
import Rive from 'rive-react-native';

interface LogoProps {
  animation?: Animation;
  logoStyles?: ViewStyle;
}

type Animation = 'wave' | 'idle' | 'loading';

const Logo = ({ animation, logoStyles }: LogoProps) => {
  const animationName = animation || 'wave';

  return (
    <Rive
      resourceName="wingler"
      artboardName="New Artboard"
      stateMachineName="State Machine 1"
      animationName={animationName}
      style={logoStyles}
      // @ts-ignore
      className="h-[120] w-[120]"
    />
  );
};

// export default Logo;
export default styled(Logo, {
  props: {
    logoStyles: true,
  },
});
