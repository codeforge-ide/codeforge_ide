/**
 * @fileoverview Theme context and provider for CodeForge IDE
 * @module themes/ThemeProvider
 * @version 1.0.0
 * @author CodeForge Team
 *
 * @description
 * Provides theme context to the entire application, manages theme state,
 * applies CSS custom properties, and handles theme persistence.
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Theme, ThemeContextValue } from './types';
import { THEMES, DEFAULT_THEME, THEME_STORAGE_KEY } from './constants';

// Create theme context
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Theme provider props
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

/**
 * Applies theme CSS custom properties to the document root
 *
 * @param theme - The theme to apply
 */
const applyThemeToDOM = (theme: Theme) => {
  const root = document.documentElement;

  // Apply color variables
  Object.entries(theme.colors.background).forEach(([key, value]) => {
    root.style.setProperty(`--color-bg-${key}`, value);
  });

  Object.entries(theme.colors.foreground).forEach(([key, value]) => {
    root.style.setProperty(`--color-fg-${key}`, value);
  });

  Object.entries(theme.colors.border).forEach(([key, value]) => {
    root.style.setProperty(`--color-border-${key}`, value);
  });

  Object.entries(theme.colors.interactive).forEach(([key, value]) => {
    root.style.setProperty(`--color-interactive-${key}`, value);
  });

  Object.entries(theme.colors.status).forEach(([key, value]) => {
    root.style.setProperty(`--color-status-${key}`, value);
  });

  Object.entries(theme.colors.syntax).forEach(([key, value]) => {
    root.style.setProperty(`--color-syntax-${key}`, value);
  });

  Object.entries(theme.colors.git).forEach(([key, value]) => {
    root.style.setProperty(`--color-git-${key}`, value);
  });

  Object.entries(theme.colors.editor).forEach(([key, value]) => {
    root.style.setProperty(`--color-editor-${key}`, value);
  });

  Object.entries(theme.colors.terminal).forEach(([key, value]) => {
    root.style.setProperty(`--color-terminal-${key}`, value);
  });

  // Apply typography variables
  Object.entries(theme.typography.fontFamily).forEach(([key, value]) => {
    root.style.setProperty(`--font-family-${key}`, value);
  });

  Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
    root.style.setProperty(`--font-size-${key}`, value);
  });

  Object.entries(theme.typography.fontWeight).forEach(([key, value]) => {
    root.style.setProperty(`--font-weight-${key}`, value.toString());
  });

  Object.entries(theme.typography.lineHeight).forEach(([key, value]) => {
    root.style.setProperty(`--line-height-${key}`, value.toString());
  });

  Object.entries(theme.typography.letterSpacing).forEach(([key, value]) => {
    root.style.setProperty(`--letter-spacing-${key}`, value);
  });

  // Apply spacing variables
  Object.entries(theme.spacing).forEach(([key, value]) => {
    root.style.setProperty(`--spacing-${key}`, value);
  });

  // Apply shadow variables
  Object.entries(theme.shadows).forEach(([key, value]) => {
    root.style.setProperty(`--shadow-${key}`, value);
  });

  // Apply border radius variables
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    root.style.setProperty(`--border-radius-${key}`, value);
  });

  // Apply transition variables
  Object.entries(theme.transitions.duration).forEach(([key, value]) => {
    root.style.setProperty(`--transition-duration-${key}`, value);
  });

  Object.entries(theme.transitions.easing).forEach(([key, value]) => {
    root.style.setProperty(`--transition-easing-${key}`, value);
  });

  // Apply theme mode class
  root.className = root.className
    .split(' ')
    .filter(cls => !cls.startsWith('theme-'))
    .concat(`theme-${theme.mode}`)
    .join(' ');

  // Set theme meta
  root.style.setProperty('--theme-id', theme.id);
  root.style.setProperty('--theme-name', theme.name);
};

/**
 * Loads theme preference from localStorage
 *
 * @returns The saved theme or default theme
 */
const loadThemeFromStorage = (): Theme => {
  try {
    const savedThemeId = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedThemeId) {
      const theme = THEMES.find(t => t.id === savedThemeId);
      if (theme) {
        return theme;
      }
    }
  } catch (error) {
    console.warn('Failed to load theme from storage:', error);
  }

  return DEFAULT_THEME;
};

/**
 * Saves theme preference to localStorage
 *
 * @param themeId - The theme ID to save
 */
const saveThemeToStorage = (themeId: string) => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, themeId);
  } catch (error) {
    console.warn('Failed to save theme to storage:', error);
  }
};

/**
 * Theme provider component that manages theme state and provides context
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = DEFAULT_THEME,
}) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    return loadThemeFromStorage();
  });

  /**
   * Sets the current theme by ID
   */
  const setTheme = useCallback((themeId: string) => {
    const theme = THEMES.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      saveThemeToStorage(themeId);
    } else {
      console.warn(`Theme with ID "${themeId}" not found`);
    }
  }, []);

  /**
   * Toggles between dark and light themes
   */
  const toggleTheme = useCallback(() => {
    const isDark = currentTheme.mode === 'dark' || currentTheme.mode === 'pitch-dark';
    const newThemeId = isDark ? 'light' : 'pitch-dark';
    setTheme(newThemeId);
  }, [currentTheme.mode, setTheme]);

  // Apply theme to DOM when theme changes
  useEffect(() => {
    applyThemeToDOM(currentTheme);
  }, [currentTheme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleMediaChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't manually set a theme
      const hasManualTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (!hasManualTheme) {
        const newThemeId = e.matches ? 'pitch-dark' : 'light';
        setTheme(newThemeId);
      }
    };

    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, [setTheme]);

  const contextValue: ThemeContextValue = {
    currentTheme,
    availableThemes: THEMES,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to access theme context
 *
 * @returns Theme context value
 * @throws Error if used outside ThemeProvider
 */
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};

/**
 * Hook to get current theme colors
 *
 * @returns Current theme colors
 */
export const useThemeColors = () => {
  const { currentTheme } = useTheme();
  return currentTheme.colors;
};

/**
 * Hook to get current theme typography
 *
 * @returns Current theme typography
 */
export const useThemeTypography = () => {
  const { currentTheme } = useTheme();
  return currentTheme.typography;
};

/**
 * Hook to get current theme spacing
 *
 * @returns Current theme spacing
 */
export const useThemeSpacing = () => {
  const { currentTheme } = useTheme();
  return currentTheme.spacing;
};

/**
 * Hook to check if current theme is dark
 *
 * @returns True if theme is dark or pitch-dark
 */
export const useIsDarkTheme = () => {
  const { currentTheme } = useTheme();
  return currentTheme.mode === 'dark' || currentTheme.mode === 'pitch-dark';
};

/**
 * Hook to check if current theme is light
 *
 * @returns True if theme is light
 */
export const useIsLightTheme = () => {
  const { currentTheme } = useTheme();
  return currentTheme.mode === 'light';
};

/**
 * Hook to check if current theme is high contrast
 *
 * @returns True if theme is high-contrast
 */
export const useIsHighContrastTheme = () => {
  const { currentTheme } = useTheme();
  return currentTheme.mode === 'high-contrast';
};
