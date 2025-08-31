/**
 * @fileoverview Themes module exports for CodeForge IDE
 * @module themes
 * @version 1.0.0
 * @author CodeForge Team
 *
 * @description
 * Exports all theme system components, types, and utilities for use
 * throughout the CodeForge IDE application.
 */

// Main theme provider
export {
  ThemeProvider,
  useTheme,
  useThemeColors,
  useThemeTypography,
  useThemeSpacing,
  useIsDarkTheme,
  useIsLightTheme,
  useIsHighContrastTheme,
} from './ThemeProvider';

// Theme constants and predefined themes
export {
  PITCH_DARK_THEME,
  DARK_THEME,
  LIGHT_THEME,
  HIGH_CONTRAST_THEME,
  THEMES,
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
} from './constants';

// Theme types and interfaces
export type {
  Theme,
  ThemeMode,
  ThemeColors,
  ThemeTypography,
  ThemeSpacing,
  ThemeShadows,
  ThemeBorderRadius,
  ThemeTransitions,
  ThemeContextValue,
  ThemePreferences,
  ThemeContribution,
} from './types';
