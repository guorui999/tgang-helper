import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tgang.helper',
  appName: 'tgang-helper',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1000,
      backgroundColor: '#4CAF50',
      androidSplashResourceName: 'splash',
    },
  },
};

export default config;
