import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

const colorMapping = {
  default: 'bg-primary',
  user: 'bg-primary',
  answer: 'bg-accent-secondary',
  askAI: 'bg-senary',
  music: 'bg-inc-spotify',
};

const padMapping = {
  none: '',
  default: 'px-4 py-2',
  even: 'p-4',
};

interface BubbleWrapProps {
  children: React.ReactNode;
  type?: keyof typeof colorMapping;
  colors?: string[];
  padding?: keyof typeof padMapping;
}

const BubbleWrap = ({ children, type, colors, padding }: BubbleWrapProps) => {
  let color;
  let gradient;
  const paddingStyle =
    padding !== undefined ? padMapping[padding] : padMapping.default;
  if (!colors) {
    color = colorMapping[type !== undefined ? type : 'default'];
    gradient = ['#ffffff30', 'transparent', '#00000060'];
  } else {
    gradient = colors;
    color = 'transparent';
  }

  return (
    <LinearGradient
      colors={gradient}
      className={`m-4 flex-1 flex-row rounded-xl shadow-lg shadow-primary-black ${color}
        ${type === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'}
        `}
    >
      <View
        className={`rounded-xl border-[1px] border-[#ffffff15] ${paddingStyle}
        ${type === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'}
        `}
      >
        {children}
      </View>
    </LinearGradient>
  );
};

export default BubbleWrap;
