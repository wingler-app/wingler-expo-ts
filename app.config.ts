import type { ExpoConfig } from '@expo/config';

const config: ExpoConfig = {
  name: 'wingler',
  slug: 'wingler',
  version: '0.0.1',
  orientation: 'portrait',
  icon: './assets/logo.png',
  userInterfaceStyle: 'light',
  scheme: 'myapp',
  splash: {
    image: './assets/logo.png',
    resizeMode: 'contain',
    backgroundColor: '#000000',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    infoPlist: {
      NSMicrophoneUsageDescription:
        'Allow $(PRODUCT_NAME) to access your microphone',
    },
    bundleIdentifier: 'com.wingler',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#000000',
    },
    permissions: ['RECORD_AUDIO', 'INTERNET'],
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
    ['@config-plugins/detox', { subdomains: '*' }],
    ['./src/plugins/my-plugin.js', './assets/picovoice'],
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