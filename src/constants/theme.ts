/**
 * THEME FILE — Change this one file to restyle the entire app.
 *
 * Inspired by CSS Zen Garden: the structure stays the same, the theme transforms it.
 * Swap colors, spacing, radii, and fonts here. Every screen reads from this file.
 */

import { Platform } from 'react-native';

const Brand = {
  primary: '#0a7ea4',
  primaryLight: '#A1CEDC',
  primaryDark: '#1D3D47',
  accent: '#FF6B35',
};

export const Colors = {
  light: {
    text: '#11181C',
    textSecondary: '#687076',
    background: '#fff',
    surface: '#F5F5F5',
    tint: Brand.primary,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: Brand.primary,
    hero: Brand.primaryLight,
    heroText: '#11181C',
    accent: Brand.accent,
    border: '#E0E0E0',
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: '#9BA1A6',
    background: '#151718',
    surface: '#1E2022',
    tint: '#fff',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
    hero: Brand.primaryDark,
    heroText: '#ECEDEE',
    accent: Brand.accent,
    border: '#2A2D2F',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radii = {
  sm: 6,
  md: 12,
  lg: 20,
  full: 9999,
};

export const Accessibility = {
  maxFontSizeMultiplier: 2,
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
