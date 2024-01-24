/// <reference types="nativewind/types" />
declare module '*.svg' {
  import type { SvgProps } from 'react-native-svg';

  const content: React.FC<SvgProps>;
  export default content;
}
