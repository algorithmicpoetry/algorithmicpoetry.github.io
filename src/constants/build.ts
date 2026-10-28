export const APP_VERSION = '0.1.0';
export const RUNTIME = 'react-native-web';
export const BUILD_ID =
  typeof import.meta !== 'undefined' && import.meta.env?.MODE
    ? `${import.meta.env.MODE}-${APP_VERSION}`
    : `dev-${APP_VERSION}`;
