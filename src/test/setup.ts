/**
 * @fileoverview Test setup configuration for CodeForge IDE
 * @module test/setup
 * @version 1.0.0
 * @author CodeForge Team
 *
 * @description
 * Configures the testing environment with jsdom, React Testing Library,
 * and custom matchers for comprehensive testing support.
 */

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, vi } from 'vitest';

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock window.ResizeObserver
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Mock window.IntersectionObserver
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
    root: null,
    rootMargin: '',
    thresholds: [],
  }));

  // Mock localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
      getItem: (key: string) => {
        return store[key] || null;
      },
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
      length: Object.keys(store).length,
      key: (index: number) => {
        const keys = Object.keys(store);
        return keys[index] || null;
      },
    };
  })();

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });

  // Mock sessionStorage
  const sessionStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
      getItem: (key: string) => {
        return store[key] || null;
      },
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
      length: Object.keys(store).length,
      key: (index: number) => {
        const keys = Object.keys(store);
        return keys[index] || null;
      },
    };
  })();

  Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
  });

  // Mock window.getComputedStyle
  window.getComputedStyle = vi.fn().mockImplementation(() => ({
    getPropertyValue: vi.fn().mockReturnValue(''),
    setProperty: vi.fn(),
    removeProperty: vi.fn(),
  }));

  // Mock document.createRange
  document.createRange = vi.fn().mockImplementation(() => ({
    setStart: vi.fn(),
    setEnd: vi.fn(),
    collapse: vi.fn(),
    selectNodeContents: vi.fn(),
    insertNode: vi.fn(),
    surroundContents: vi.fn(),
    cloneRange: vi.fn(),
    deleteContents: vi.fn(),
    extractContents: vi.fn(),
    getBoundingClientRect: vi.fn().mockReturnValue({
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0,
      x: 0,
      y: 0,
      toJSON: vi.fn(),
    }),
    getClientRects: vi.fn().mockReturnValue([]),
  }));

  // Mock scrollTo
  window.scrollTo = vi.fn();
  Element.prototype.scrollTo = vi.fn();

  // Mock scrollIntoView
  Element.prototype.scrollIntoView = vi.fn();

  // Mock CSS custom properties
  const mockStyleDeclaration = {
    setProperty: vi.fn(),
    getPropertyValue: vi.fn().mockReturnValue(''),
    removeProperty: vi.fn(),
  };

  Object.defineProperty(document.documentElement, 'style', {
    value: mockStyleDeclaration,
    writable: true,
  });

  // Mock custom events
  global.CustomEvent = vi.fn().mockImplementation((type, options) => ({
    type,
    detail: options?.detail,
    bubbles: options?.bubbles || false,
    cancelable: options?.cancelable || false,
    composed: options?.composed || false,
  }));

  // Mock clipboard API
  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: vi.fn().mockResolvedValue(undefined),
      readText: vi.fn().mockResolvedValue(''),
    },
    writable: true,
  });

  // Mock user agent
  Object.defineProperty(navigator, 'userAgent', {
    value: 'Mozilla/5.0 (jsdom)',
    writable: true,
  });

  // Suppress console warnings in tests
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('React does not recognize the') &&
      args[0].includes('prop on a DOM element')
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

// Global test utilities
declare global {
  namespace Vi {
    interface JestAssertion<T = any> {
      toBeInTheDocument(): T;
      toHaveClass(className: string): T;
      toHaveStyle(style: Record<string, any>): T;
      toBeVisible(): T;
      toBeDisabled(): T;
      toHaveAttribute(attr: string, value?: string): T;
      toHaveTextContent(text: string | RegExp): T;
      toHaveValue(value: string | number): T;
      toBeChecked(): T;
      toHaveFocus(): T;
    }
  }
}

// Test helper functions
export const mockTheme = {
  id: 'test-theme',
  name: 'Test Theme',
  mode: 'dark' as const,
  colors: {
    background: {
      primary: '#000000',
      secondary: '#111111',
      tertiary: '#222222',
      elevated: '#333333',
      overlay: 'rgba(0, 0, 0, 0.8)',
    },
    foreground: {
      primary: '#ffffff',
      secondary: '#cccccc',
      tertiary: '#888888',
      disabled: '#555555',
      inverse: '#000000',
    },
    border: {
      primary: '#444444',
      secondary: '#333333',
      focus: '#007acc',
      error: '#ff0000',
      warning: '#ffff00',
      success: '#00ff00',
    },
    interactive: {
      primary: '#007acc',
      primaryHover: '#1088d1',
      secondary: '#333333',
      secondaryHover: '#444444',
      accent: '#007acc',
      accentHover: '#1088d1',
    },
    status: {
      error: '#ff0000',
      warning: '#ffff00',
      success: '#00ff00',
      info: '#00ffff',
      errorBg: 'rgba(255, 0, 0, 0.1)',
      warningBg: 'rgba(255, 255, 0, 0.1)',
      successBg: 'rgba(0, 255, 0, 0.1)',
      infoBg: 'rgba(0, 255, 255, 0.1)',
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
      wordHighlight: 'rgba(255, 255, 255, 0.2)',
      bracket: '#ffff00',
      indent: '#444444',
      ruler: '#666666',
      whitespace: '#444444',
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
  typography: {
    fontFamily: {
      sans: 'system-ui',
      mono: 'monospace',
      code: 'monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      xxl: '1.5rem',
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
  },
  spacing: {
    px: '1px',
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem',
  },
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  },
  transitions: {
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
  },
};

export const createMockCommand = (overrides = {}) => ({
  id: 'test-command',
  title: 'Test Command',
  description: 'A test command',
  category: 'test' as const,
  keywords: ['test'],
  action: {
    id: 'test-command',
    execute: vi.fn(),
  },
  ...overrides,
});
