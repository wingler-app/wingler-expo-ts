import 'expo-router/entry';

import * as SystemUI from 'expo-system-ui';
import { LogBox } from 'react-native';

SystemUI.setBackgroundColorAsync('#151523');
LogBox.ignoreLogs(['new NativeEventEmitter()']);
