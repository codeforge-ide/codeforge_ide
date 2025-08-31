/**
 * @fileoverview Theme constants and predefined themes for CodeForge IDE
 * @module themes/constants
 * @version 1.0.0
 * @author CodeForge Team
 *
 * @description
 * Defines all predefined themes including pitch dark, dark, light, and high contrast.
 * Contains color palettes, typography settings, and theme configurations.
 */

import { Theme, ThemeMode } from './types';

// Base typography configuration (shared across themes)
const baseTypography = {
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", "SF Mono", Monaco, Inconsolata, "Roboto Mono", Consolas, "Courier New", monospace',
    code: '"JetBrains Mono", "Fira Code", "SF Mono", Monaco, Inconsolata, "Roboto Mono", Consolas, "Courier New", monospace',
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.8125rem',  // 13px
    base: '0.875rem', // 14px
    lg: '1rem',       // 16px
    xl: '1.125rem',   // 18px
    xxl: '1.25rem',   // 20px
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
  },
};

// Base spacing configuration (shared across themes)
const baseSpacing = {
  px: '1px',
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem',    // 96px
  32: '8rem',    // 128px
};

// Base shadows (shared across themes)
const baseShadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
};

// Base border radius (shared across themes)
const baseBorderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  full: '9999px',
};

// Base transitions (shared across themes)
const baseTransitions = {
  duration: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
  },
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

// PITCH DARK THEME - Darkest possible theme
export const PITCH_DARK_THEME: Theme = {
  id: 'pitch-dark',
  name: 'Pitch Dark',
  mode: 'pitch-dark' as ThemeMode,
  colors: {
    background: {
      primary: '#000000',      // Pure black
      secondary: '#0a0a0a',    // Almost black
      tertiary: '#111111',     // Dark hover
      elevated: '#161616',     // Modals/dropdowns
      overlay: 'rgba(0, 0, 0, 0.8)',
    },
    foreground: {
      primary: '#e8e8e8',      // Light gray text
      secondary: '#cccccc',    // Medium gray text
      tertiary: '#888888',     // Muted text
      disabled: '#555555',     // Disabled text
      inverse: '#000000',      // Black text on light bg
    },
    border: {
      primary: '#222222',      // Dark borders
      secondary: '#1a1a1a',    // Subtle borders
      focus: '#007acc',        // Blue focus
      error: '#f14c4c',        // Red error
      warning: '#ffcc02',      // Yellow warning
      success: '#89d185',      // Green success
    },
    interactive: {
      primary: '#0e639c',      // Dark blue primary
      primaryHover: '#1177bb',
      secondary: '#2d2d30',    // Dark secondary
      secondaryHover: '#3e3e42',
      accent: '#007acc',       // Blue accent
      accentHover: '#1088d1',
    },
    status: {
      error: '#f14c4c',
      warning: '#ffcc02',
      success: '#89d185',
      info: '#75beff',
      errorBg: 'rgba(241, 76, 76, 0.1)',
      warningBg: 'rgba(255, 204, 2, 0.1)',
      successBg: 'rgba(137, 209, 133, 0.1)',
      infoBg: 'rgba(117, 190, 255, 0.1)',
    },
    syntax: {
      comment: '#6a9955',      // Green comments
      keyword: '#569cd6',      // Blue keywords
      string: '#ce9178',       // Orange strings
      number: '#b5cea8',       // Light green numbers
      boolean: '#569cd6',      // Blue booleans
      function: '#dcdcaa',     // Yellow functions
      variable: '#9cdcfe',     // Light blue variables
      type: '#4ec9b0',         // Teal types
      class: '#4ec9b0',        // Teal classes
      operator: '#d4d4d4',     // Light gray operators
      punctuation: '#d4d4d4',  // Light gray punctuation
      tag: '#569cd6',          // Blue HTML tags
      attribute: '#9cdcfe',    // Light blue attributes
      property: '#9cdcfe',     // Light blue CSS properties
      value: '#ce9178',        // Orange CSS values
    },
    git: {
      added: '#89d185',        // Green
      modified: '#e2c08d',     // Orange
      deleted: '#f14c4c',      // Red
      renamed: '#73c991',      // Light green
      untracked: '#73c991',    // Light green
      ignored: '#8c8c8c',      // Gray
      conflicted: '#c74e39',   // Dark red
    },
    editor: {
      background: '#000000',
      lineNumber: '#444444',
      lineNumberActive: '#cccccc',
      selection: 'rgba(173, 214, 255, 0.15)',
      selectionHighlight: 'rgba(173, 214, 255, 0.07)',
      findMatch: 'rgba(234, 92, 0, 0.33)',
      findMatchActive: 'rgba(234, 92, 0, 0.66)',
      wordHighlight: 'rgba(87, 87, 87, 0.25)',
      bracket: '#ffd700',
      indent: '#404040',
      ruler: '#5a5a5a',
      whitespace: '#404040',
    },
    terminal: {
      background: '#000000',
      foreground: '#cccccc',
      cursor: '#ffffff',
      selection: 'rgba(255, 255, 255, 0.2)',
      black: '#000000',
      red: '#cd3131',
      green: '#0dbc79',
      yellow: '#e5e510',
      blue: '#2472c8',
      magenta: '#bc3fbc',
      cyan: '#11a8cd',
      white: '#e5e5e5',
      brightBlack: '#666666',
      brightRed: '#f14c4c',
      brightGreen: '#23d18b',
      brightYellow: '#f5f543',
      brightBlue: '#3b8eea',
      brightMagenta: '#d670d6',
      brightCyan: '#29b8db',
      brightWhite: '#ffffff',
    },
  },
  typography: baseTypography,
  spacing: baseSpacing,
  shadows: baseShadows,
  borderRadius: baseBorderRadius,
  transitions: baseTransitions,
};

// DARK THEME - Standard dark theme
export const DARK_THEME: Theme = {
  id: 'dark',
  name: 'Dark',
  mode: 'dark' as ThemeMode,
  colors: {
    background: {
      primary: '#1e1e1e',
      secondary: '#252526',
      tertiary: '#2d2d30',
      elevated: '#383838',
      overlay: 'rgba(0, 0, 0, 0.6)',
    },
    foreground: {
      primary: '#cccccc',
      secondary: '#bbbbbb',
      tertiary: '#888888',
      disabled: '#656565',
      inverse: '#1e1e1e',
    },
    border: {
      primary: '#3e3e42',
      secondary: '#2d2d30',
      focus: '#007acc',
      error: '#f14c4c',
      warning: '#ffcc02',
      success: '#89d185',
    },
    interactive: {
      primary: '#0e639c',
      primaryHover: '#1177bb',
      secondary: '#3c3c3c',
      secondaryHover: '#464647',
      accent: '#007acc',
      accentHover: '#1088d1',
    },
    status: {
      error: '#f14c4c',
      warning: '#ffcc02',
      success: '#89d185',
      info: '#75beff',
      errorBg: 'rgba(241, 76, 76, 0.15)',
      warningBg: 'rgba(255, 204, 2, 0.15)',
      successBg: 'rgba(137, 209, 133, 0.15)',
      infoBg: 'rgba(117, 190, 255, 0.15)',
    },
    syntax: {
      comment: '#6a9955',
      keyword: '#569cd6',
      string: '#ce9178',
      number: '#b5cea8',
      boolean: '#569cd6',
      function: '#dcdcaa',
      variable: '#9cdcfe',
      type: '#4ec9b0',
      class: '#4ec9b0',
      operator: '#d4d4d4',
      punctuation: '#d4d4d4',
      tag: '#569cd6',
      attribute: '#9cdcfe',
      property: '#9cdcfe',
      value: '#ce9178',
    },
    git: {
      added: '#89d185',
      modified: '#e2c08d',
      deleted: '#f14c4c',
      renamed: '#73c991',
      untracked: '#73c991',
      ignored: '#8c8c8c',
      conflicted: '#c74e39',
    },
    editor: {
      background: '#1e1e1e',
      lineNumber: '#858585',
      lineNumberActive: '#cccccc',
      selection: 'rgba(173, 214, 255, 0.15)',
      selectionHighlight: 'rgba(173, 214, 255, 0.07)',
      findMatch: 'rgba(234, 92, 0, 0.33)',
      findMatchActive: 'rgba(234, 92, 0, 0.66)',
      bracket: '#ffd700',
      indent: '#404040',
      ruler: '#5a5a5a',
      whitespace: '#404040',
      wordHighlight: 'rgba(87, 87, 87, 0.25)',
    },
    terminal: {
      background: '#1e1e1e',
      foreground: '#cccccc',
      cursor: '#ffffff',
      selection: 'rgba(255, 255, 255, 0.2)',
      black: '#000000',
      red: '#cd3131',
      green: '#0dbc79',
      yellow: '#e5e510',
      blue: '#2472c8',
      magenta: '#bc3fbc',
      cyan: '#11a8cd',
      white: '#e5e5e5',
      brightBlack: '#666666',
      brightRed: '#f14c4c',
      brightGreen: '#23d18b',
      brightYellow: '#f5f543',
      brightBlue: '#3b8eea',
      brightMagenta: '#d670d6',
      brightCyan: '#29b8db',
      brightWhite: '#ffffff',
    },
  },
  typography: baseTypography,
  spacing: baseSpacing,
  shadows: baseShadows,
  borderRadius: baseBorderRadius,
  transitions: baseTransitions,
};

// LIGHT THEME - Standard light theme
export const LIGHT_THEME: Theme = {
  id: 'light',
  name: 'Light',
  mode: 'light' as ThemeMode,
  colors: {
    background: {
      primary: '#ffffff',
      secondary: '#f8f8f8',
      tertiary: '#f0f0f0',
      elevated: '#ffffff',
      overlay: 'rgba(0, 0, 0, 0.4)',
    },
    foreground: {
      primary: '#333333',
      secondary: '#666666',
      tertiary: '#888888',
      disabled: '#bbbbbb',
      inverse: '#ffffff',
    },
    border: {
      primary: '#e0e0e0',
      secondary: '#f0f0f0',
      focus: '#0078d4',
      error: '#e53e3e',
      warning: '#d69e2e',
      success: '#38a169',
    },
    interactive: {
      primary: '#0078d4',
      primaryHover: '#106ebe',
      secondary: '#e0e0e0',
      secondaryHover: '#d0d0d0',
      accent: '#0078d4',
      accentHover: '#106ebe',
    },
    status: {
      error: '#e53e3e',
      warning: '#d69e2e',
      success: '#38a169',
      info: '#3182ce',
      errorBg: 'rgba(229, 62, 62, 0.1)',
      warningBg: 'rgba(214, 158, 46, 0.1)',
      successBg: 'rgba(56, 161, 105, 0.1)',
      infoBg: 'rgba(49, 130, 206, 0.1)',
    },
    syntax: {
      comment: '#008000',
      keyword: '#0000ff',
      string: '#a31515',
      number: '#098658',
      boolean: '#0000ff',
      function: '#795e26',
      variable: '#001080',
      type: '#267f99',
      class: '#267f99',
      operator: '#000000',
      punctuation: '#000000',
      tag: '#800000',
      attribute: '#ff0000',
      property: '#ff0000',
      value: '#0451a5',
    },
    git: {
      added: '#28a745',
      modified: '#ff6f00',
      deleted: '#dc3545',
      renamed: '#28a745',
      untracked: '#28a745',
      ignored: '#6c757d',
      conflicted: '#dc3545',
    },
    editor: {
      background: '#ffffff',
      lineNumber: '#237893',
      lineNumberActive: '#0b216f',
      selection: 'rgba(173, 214, 255, 0.3)',
      selectionHighlight: 'rgba(173, 214, 255, 0.15)',
      findMatch: 'rgba(255, 215, 0, 0.6)',
      findMatchActive: 'rgba(255, 215, 0, 0.8)',
      bracket: '#0431fa',
      indent: '#d3d3d3',
      ruler: '#d3d3d3',
      whitespace: '#d3d3d3',
      wordHighlight: 'rgba(87, 87, 87, 0.15)',
    },
    terminal: {
      background: '#ffffff',
      foreground: '#333333',
      cursor: '#000000',
      selection: 'rgba(0, 0, 0, 0.2)',
      black: '#000000',
      red: '#cd3131',
      green: '#00bc00',
      yellow: '#949800',
      blue: '#0451a5',
      magenta: '#bc05bc',
      cyan: '#0598bc',
      white: '#555555',
      brightBlack: '#666666',
      brightRed: '#cd3131',
      brightGreen: '#14ce14',
      brightYellow: '#b5ba00',
      brightBlue: '#0451a5',
      brightMagenta: '#bc05bc',
      brightCyan: '#0598bc',
      brightWhite: '#a5a5a5',
    },
  },
  typography: baseTypography,
  spacing: baseSpacing,
  shadows: baseShadows,
  borderRadius: baseBorderRadius,
  transitions: baseTransitions,
};

// HIGH CONTRAST THEME - Accessibility focused theme
export const HIGH_CONTRAST_THEME: Theme = {
  id: 'high-contrast',
  name: 'High Contrast',
  mode: 'high-contrast' as ThemeMode,
  colors: {
    background: {
      primary: '#000000',
      secondary: '#000000',
      tertiary: '#1a1a1a',
      elevated: '#000000',
      overlay: 'rgba(0, 0, 0, 0.9)',
    },
    foreground: {
      primary: '#ffffff',
      secondary: '#ffffff',
      tertiary: '#cccccc',
      disabled: '#888888',
      inverse: '#000000',
    },
    border: {
      primary: '#ffffff',
      secondary: '#888888',
      focus: '#ffff00',
      error: '#ff0000',
      warning: '#ffff00',
      success: '#00ff00',
    },
    interactive: {
      primary: '#ffffff',
      primaryHover: '#cccccc',
      secondary: '#888888',
      secondaryHover: '#aaaaaa',
      accent: '#ffff00',
      accentHover: '#cccc00',
    },
    status: {
      error: '#ff0000',
      warning: '#ffff00',
      success: '#00ff00',
      info: '#00ffff',
      errorBg: 'rgba(255, 0, 0, 0.2)',
      warningBg: 'rgba(255, 255, 0, 0.2)',
      successBg: 'rgba(0, 255, 0, 0.2)',
      infoBg: 'rgba(0, 255, 255, 0.2)',
    },
    syntax: {
      comment: '#888888',
      keyword: '#00ffff',
      string: '#ffff00',
      number: '#00ff00',
      boolean: '#00ffff',
      function: '#ffffff',
      variable: '#ffffff',
      type: '#00ffff',
      class: '#00ffff',
      operator: '#ffffff',
      punctuation: '#ffffff',
      tag: '#00ffff',
      attribute: '#ffff00',
      property: '#ffff00',
      value: '#00ff00',
    },
    git: {
      added: '#00ff00',
      modified: '#ffff00',
      deleted: '#ff0000',
      renamed: '#00ff00',
      untracked: '#00ff00',
      ignored: '#888888',
      conflicted: '#ff0000',
    },
    editor: {
      background: '#000000',
      lineNumber: '#888888',
      lineNumberActive: '#ffffff',
      selection: 'rgba(255, 255, 255, 0.2)',
      selectionHighlight: 'rgba(255, 255, 255, 0.1)',
      findMatch: 'rgba(255, 255, 0, 0.4)',
      findMatchActive: 'rgba(255, 255, 0, 0.6)',
      bracket: '#ffff00',
      indent: '#444444',
      ruler: '#666666',
      whitespace: '#444444',
      wordHighlight: 'rgba(255, 255, 255, 0.2)',
    },
    terminal: {
      background: '#000000',
      foreground: '#ffffff',
      cursor: '#ffffff',
      selection: 'rgba(255, 255, 255, 0.3)',
      black: '#000000',
      red: '#ff0000',
      green: '#00ff00',
      yellow: '#ffff00',
      blue: '#0000ff',
      magenta: '#ff00ff',
      cyan: '#00ffff',
      white: '#ffffff',
      brightBlack: '#888888',
      brightRed: '#ff0000',
      brightGreen: '#00ff00',
      brightYellow: '#ffff00',
      brightBlue: '#0000ff',
      brightMagenta: '#ff00ff',
      brightCyan: '#00ffff',
      brightWhite: '#ffffff',
    },
  },
  typography: baseTypography,
  spacing: baseSpacing,
  shadows: {
    ...baseShadows,
    base: '0 0 0 2px #ffffff',
    md: '0 0 0 3px #ffffff',
    lg: '0 0 0 4px #ffffff',
  },
  borderRadius: baseBorderRadius,
  transitions: baseTransitions,
};

// All available themes
export const THEMES: Theme[] = [
  PITCH_DARK_THEME,
  DARK_THEME,
  LIGHT_THEME,
  HIGH_CONTRAST_THEME,
];

// Default theme
export const DEFAULT_THEME = PITCH_DARK_THEME;

// Theme storage key
export const THEME_STORAGE_KEY = 'codeforge-theme';
