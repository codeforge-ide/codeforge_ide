/**
 * @fileoverview Theme type definitions and interfaces for CodeForge IDE
 * @module themes/types
 * @version 1.0.0
 * @author CodeForge Team
 *
 * @description
 * Defines the core theme system types including color palettes, typography,
 * spacing, and theme metadata. Supports multiple theme variants including
 * pitch dark, dark, light, and high contrast modes.
 */

export type ThemeMode = 'pitch-dark' | 'dark' | 'light' | 'high-contrast';

export interface ThemeColors {
  // Background colors
  background: {
    primary: string;      // Main background
    secondary: string;    // Secondary panels
    tertiary: string;     // Hover states
    elevated: string;     // Modals, dropdowns
    overlay: string;      // Overlay backgrounds
  };

  // Foreground colors
  foreground: {
    primary: string;      // Main text
    secondary: string;    // Secondary text
    tertiary: string;     // Muted text
    disabled: string;     // Disabled text
    inverse: string;      // Text on dark backgrounds
  };

  // Border colors
  border: {
    primary: string;      // Main borders
    secondary: string;    // Subtle borders
    focus: string;        // Focus indicators
    error: string;        // Error borders
    warning: string;      // Warning borders
    success: string;      // Success borders
  };

  // Interactive colors
  interactive: {
    primary: string;      // Primary buttons
    primaryHover: string; // Primary button hover
    secondary: string;    // Secondary buttons
    secondaryHover: string; // Secondary button hover
    accent: string;       // Accent elements
    accentHover: string;  // Accent hover
  };

  // Status colors
  status: {
    error: string;        // Error states
    warning: string;      // Warning states
    success: string;      // Success states
    info: string;         // Info states
    errorBg: string;      // Error backgrounds
    warningBg: string;    // Warning backgrounds
    successBg: string;    // Success backgrounds
    infoBg: string;       // Info backgrounds
  };

  // Syntax highlighting colors
  syntax: {
    comment: string;      // Comments
    keyword: string;      // Keywords
    string: string;       // Strings
    number: string;       // Numbers
    boolean: string;      // Booleans
    function: string;     // Functions
    variable: string;     // Variables
    type: string;         // Types
    class: string;        // Classes
    operator: string;     // Operators
    punctuation: string;  // Punctuation
    tag: string;          // HTML tags
    attribute: string;    // HTML attributes
    property: string;     // CSS properties
    value: string;        // CSS values
  };

  // Git colors
  git: {
    added: string;        // Added lines
    modified: string;     // Modified lines
    deleted: string;      // Deleted lines
    renamed: string;      // Renamed files
    untracked: string;    // Untracked files
    ignored: string;      // Ignored files
    conflicted: string;   // Conflicted files
  };

  // Editor specific colors
  editor: {
    background: string;       // Editor background
    lineNumber: string;       // Line numbers
    lineNumberActive: string; // Active line number
    selection: string;        // Text selection
    selectionHighlight: string; // Selection highlight
    findMatch: string;        // Find matches
    findMatchActive: string;  // Active find match
    wordHighlight: string;    // Word highlights
    bracket: string;          // Bracket matching
    indent: string;           // Indentation guides
    ruler: string;            // Column rulers
    whitespace: string;       // Whitespace characters
  };

  // Terminal colors
  terminal: {
    background: string;   // Terminal background
    foreground: string;   // Terminal text
    cursor: string;       // Terminal cursor
    selection: string;    // Terminal selection
    black: string;        // ANSI black
    red: string;          // ANSI red
    green: string;        // ANSI green
    yellow: string;       // ANSI yellow
    blue: string;         // ANSI blue
    magenta: string;      // ANSI magenta
    cyan: string;         // ANSI cyan
    white: string;        // ANSI white
    brightBlack: string;  // ANSI bright black
    brightRed: string;    // ANSI bright red
    brightGreen: string;  // ANSI bright green
    brightYellow: string; // ANSI bright yellow
    brightBlue: string;   // ANSI bright blue
    brightMagenta: string; // ANSI bright magenta
    brightCyan: string;   // ANSI bright cyan
    brightWhite: string;  // ANSI bright white
  };
}

export interface ThemeTypography {
  fontFamily: {
    sans: string;         // Sans-serif font stack
    mono: string;         // Monospace font stack
    code: string;         // Code font stack
  };

  fontSize: {
    xs: string;           // Extra small text
    sm: string;           // Small text
    base: string;         // Base font size
    lg: string;           // Large text
    xl: string;           // Extra large text
    xxl: string;          // Double extra large
  };

  fontWeight: {
    light: number;        // Light weight
    normal: number;       // Normal weight
    medium: number;       // Medium weight
    semibold: number;     // Semibold weight
    bold: number;         // Bold weight
  };

  lineHeight: {
    tight: number;        // Tight line height
    normal: number;       // Normal line height
    relaxed: number;      // Relaxed line height
  };

  letterSpacing: {
    tight: string;        // Tight letter spacing
    normal: string;       // Normal letter spacing
    wide: string;         // Wide letter spacing
  };
}

export interface ThemeSpacing {
  px: string;             // 1px
  0: string;              // 0
  1: string;              // 0.25rem
  2: string;              // 0.5rem
  3: string;              // 0.75rem
  4: string;              // 1rem
  5: string;              // 1.25rem
  6: string;              // 1.5rem
  8: string;              // 2rem
  10: string;             // 2.5rem
  12: string;             // 3rem
  16: string;             // 4rem
  20: string;             // 5rem
  24: string;             // 6rem
  32: string;             // 8rem
}

export interface ThemeShadows {
  none: string;           // No shadow
  sm: string;             // Small shadow
  base: string;           // Base shadow
  md: string;             // Medium shadow
  lg: string;             // Large shadow
  xl: string;             // Extra large shadow
  inner: string;          // Inner shadow
}

export interface ThemeBorderRadius {
  none: string;           // No radius
  sm: string;             // Small radius
  base: string;           // Base radius
  md: string;             // Medium radius
  lg: string;             // Large radius
  xl: string;             // Extra large radius
  full: string;           // Full radius
}

export interface ThemeTransitions {
  duration: {
    fast: string;         // Fast transition
    normal: string;       // Normal transition
    slow: string;         // Slow transition
  };

  easing: {
    linear: string;       // Linear easing
    ease: string;         // Ease easing
    easeIn: string;       // Ease in
    easeOut: string;      // Ease out
    easeInOut: string;    // Ease in out
  };
}

export interface Theme {
  id: string;             // Unique theme identifier
  name: string;           // Display name
  mode: ThemeMode;        // Theme mode
  colors: ThemeColors;    // Color palette
  typography: ThemeTypography; // Typography settings
  spacing: ThemeSpacing;  // Spacing scale
  shadows: ThemeShadows;  // Shadow definitions
  borderRadius: ThemeBorderRadius; // Border radius scale
  transitions: ThemeTransitions; // Transition settings
}

export interface ThemeContextValue {
  currentTheme: Theme;    // Currently active theme
  availableThemes: Theme[]; // All available themes
  setTheme: (themeId: string) => void; // Theme setter
  toggleTheme: () => void; // Theme toggler
}

// Theme preference storage
export interface ThemePreferences {
  selectedThemeId: string; // User's preferred theme
  autoDetectSystemTheme: boolean; // Auto-detect system theme
  customThemes: Theme[];   // User-defined custom themes
}

// Theme configuration for extensions
export interface ThemeContribution {
  id: string;             // Extension theme ID
  name: string;           // Theme display name
  mode: ThemeMode;        // Base theme mode
  extends?: string;       // Base theme to extend
  colors?: Partial<ThemeColors>; // Color overrides
  typography?: Partial<ThemeTypography>; // Typography overrides
}
