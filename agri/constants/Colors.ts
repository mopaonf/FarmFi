/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

const primaryGreen = '#16a34a';
const primaryGreenLight = '#22c55e';
const primaryGreenDark = '#15803d';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    white: '#fff',
    tint: primaryGreen,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: primaryGreen,
    primary: primaryGreen,
    primaryLight: primaryGreenLight,
    primaryDark: primaryGreenDark,
    secondary: '#gray-600',
    accent: '#22c55e',
    gray: '#f3f4f6',
    grayLight: '#f9fafb',
    grayDark: '#374151',
    grayDarker: '#1f2937',
    success: '#16a34a',
    error: '#ef4444',
    warning: '#f59e0b',
    surface: '#ffffff',
    surfaceHover: '#f8fafc',
    border: '#e2e8f0',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: primaryGreen,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: primaryGreen,
    primary: primaryGreen,
    primaryLight: primaryGreenLight,
    primaryDark: primaryGreenDark,
  },
};
