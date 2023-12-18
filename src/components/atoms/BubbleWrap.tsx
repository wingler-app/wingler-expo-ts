import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

const colorMapping = {
  default: 'bg-primary',
  user: 'bg-accent-secondary',
  answer: 'bg-primary',
  askAI: 'bg-senary',
  music: 'bg-inc-spotify',
  image: 'bg-senary',
  map: 'bg-[#c0abff50]',
};

const padMapping = {
  default: 'px-4 py-2',
  even: 'p-4',
  none: '',
};

interface BubbleWrapProps {
  children: React.ReactNode;
  type?: keyof typeof colorMapping;
  colors?: string[];
  padding?: keyof typeof padMapping;
}

const BubbleWrap = ({ children, type, colors, padding }: BubbleWrapProps) => {
  const color = colors ? 'transparent' : colorMapping[type || 'default'];
  const gradient = colors || ['#ffffff20', 'transparent', '#00000040'];
  const paddingStyle = padMapping[padding || 'default'];

  return (
    <LinearGradient
      colors={gradient}
      className={`m-4 flex-1 flex-row rounded-xl shadow-lg shadow-primary-black ${color}
        ${type === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'}
        `}
    >
      <View
        className={`overflow-hidden rounded-xl border-[1px] border-[#ffffff15] ${paddingStyle}
        ${type === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'}
        `}
      >
        {children}
      </View>
    </LinearGradient>
  );
};

export default BubbleWrap;
