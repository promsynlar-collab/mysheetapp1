import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sheetdrive.app',
  appName: 'SheetDrive Mobile',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
