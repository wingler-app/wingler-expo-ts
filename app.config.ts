import type { ExpoConfig } from '@expo/config';

export const config: ExpoConfig = {
  name: 'wingler',
  slug: 'wingler',
  version: '0.0.1',
  orientation: 'portrait',
  icon: './assets/ios-icon.jpg',
  userInterfaceStyle: 'dark',
  scheme: 'com.wingler',
  splash: {
    image: './assets/logo-splash.png',
    resizeMode: 'contain',
    backgroundColor: '#151523',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    googleServicesFile: './GoogleService-Info.plist',
    supportsTablet: true,
    infoPlist: {
      NSMicrophoneUsageDescription:
        'Allow $(PRODUCT_NAME) to access your microphone',
    },
    bundleIdentifier: 'com.wingler',
    entitlements: {
      'com.apple.developer.networking.wifi-info': true,
    },
  },
  android: {
    config: {
      googleMaps: {
        apiKey: 'AIzaSyBfA8snPSRFtL3IN99IlscknLiUM5E852A',
      },
    },
    googleServicesFile: './google-services.json',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon/foreground.png',
      backgroundImage: './assets/adaptive-icon/background.png',
    },
    permissions: [
      'RECORD_AUDIO',
      'INTERNET',
      'ACCESS_BACKGROUND_LOCATION',
      'ACCESS_FINE_LOCATION',
      'ACCESS_COARSE_LOCATION',
    ],
    package: 'com.wingler',
    intentFilters: [
      {
        action: 'VIEW',
        autoVerify: true,
        data: [
          {
            scheme: 'https',
            host: '*.wingler',
            pathPrefix: '/settings',
          },
          {
            scheme: 'https',
            host: 'com.wingler',
            pathPrefix: ':/settings',
          },
        ],
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ],
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
  },
  plugins: [
    'expo-router',
    [
      'expo-calendar',
      {
        calendarPermission:
          'Allow $(PRODUCT_NAME) needs to access your calendar.',
      },
    ],
    [
      'expo-contacts',
      {
        contactsPermission: 'Allow $(PRODUCT_NAME) to access your contacts.',
      },
    ],
    [
      'expo-local-authentication',
      {
        faceIDPermission: 'Allow $(PRODUCT_NAME) to use Face ID.',
      },
    ],
    [
      'expo-build-properties',
      {
        ios: {
          useFrameworks: 'static',
        },
      },
    ],
    ['@config-plugins/detox', { subdomains: '*' }],
    ['./src/plugins/my-plugin.js', './assets/picovoice'],
    [
      '@react-native-voice/voice',
      {
        microphonePermission: 'Allow $(PRODUCT_NAME) to access the microphone',
        speechRecognitionPermission:
          'Allow $(PRODUCT_NAME) to securely recognize user speech',
      },
    ],
    [
      'expo-location',
      {
        locationAlwaysAndWhenInUsePermission:
          'Allow $(PRODUCT_NAME) to use your location.',
        isAndroidBackgroundLocationEnabled: true,
      },
    ],
    '@react-native-firebase/app',
    // '@react-native-firebase/perf',
    // '@react-native-firebase/crashlytics',
  ],
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: 'dcf93cd7-8557-48ef-8af6-e9a166239f6c',
    },
  },
  owner: 'developer_mektig',
};

export default config;
