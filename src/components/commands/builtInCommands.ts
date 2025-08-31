/**
 * @fileoverview Built-in commands for CodeForge IDE
 * @module components/commands/builtInCommands
 * @version 1.0.0
 * @author CodeForge Team
 *
 * @description
 * Defines all built-in commands including theme switching, file operations,
 * view commands, and general IDE functionality.
 */

import { Command, BUILT_IN_COMMANDS } from './types';
import { THEMES } from '../../themes/constants';

/**
 * Create theme commands for each available theme
 */
const createThemeCommands = (): Command[] => {
  const themeCommands: Command[] = [];

  // Individual theme selection commands
  THEMES.forEach(theme => {
    themeCommands.push({
      id: `theme.select.${theme.id}`,
      title: `Theme: ${theme.name}`,
      description: `Switch to ${theme.name} theme`,
      category: 'theme',
      keywords: ['theme', 'color', 'appearance', theme.name.toLowerCase()],
      icon: 'palette',
      priority: 70,
      action: {
        id: `theme.select.${theme.id}`,
        execute: () => {
          // Theme switching will be handled by the theme context
          const event = new CustomEvent('codeforge:setTheme', {
            detail: { themeId: theme.id }
          });
          window.dispatchEvent(event);
        },
      },
    });
  });

  // General theme commands
  themeCommands.push(
    {
      id: BUILT_IN_COMMANDS.THEME_SELECT,
      title: 'Theme: Select Color Theme',
      description: 'Select and preview available color themes',
      category: 'theme',
      keywords: ['theme', 'color', 'appearance', 'select'],
      icon: 'palette',
      priority: 80,
      keybinding: {
        key: 't',
        modifiers: ['ctrl', 'shift'],
        displayText: 'Ctrl+Shift+T',
      },
      action: {
        id: BUILT_IN_COMMANDS.THEME_SELECT,
        execute: () => {
          const event = new CustomEvent('codeforge:showThemeSelector');
          window.dispatchEvent(event);
        },
      },
    },
    {
      id: BUILT_IN_COMMANDS.THEME_TOGGLE,
      title: 'Theme: Toggle Dark/Light',
      description: 'Toggle between dark and light themes',
      category: 'theme',
      keywords: ['theme', 'toggle', 'dark', 'light'],
      icon: 'moon',
      priority: 75,
      action: {
        id: BUILT_IN_COMMANDS.THEME_TOGGLE,
        execute: () => {
          const event = new CustomEvent('codeforge:toggleTheme');
          window.dispatchEvent(event);
        },
      },
    }
  );

  return themeCommands;
};

/**
 * File operation commands
 */
const createFileCommands = (): Command[] => [
  {
    id: BUILT_IN_COMMANDS.FILE_NEW,
    title: 'File: New File',
    description: 'Create a new untitled file',
    category: 'file',
    keywords: ['file', 'new', 'create'],
    icon: 'file-plus',
    priority: 90,
    keybinding: {
      key: 'n',
      modifiers: ['ctrl'],
      displayText: 'Ctrl+N',
    },
    action: {
      id: BUILT_IN_COMMANDS.FILE_NEW,
      execute: () => {
        console.log('Creating new file...');
        // TODO: Implement file creation
      },
    },
  },
  {
    id: BUILT_IN_COMMANDS.FILE_OPEN,
    title: 'File: Open File',
    description: 'Open an existing file',
    category: 'file',
    keywords: ['file', 'open'],
    icon: 'folder-open',
    priority: 85,
    keybinding: {
      key: 'o',
      modifiers: ['ctrl'],
      displayText: 'Ctrl+O',
    },
    action: {
      id: BUILT_IN_COMMANDS.FILE_OPEN,
      execute: () => {
        console.log('Opening file...');
        // TODO: Implement file opening
      },
    },
  },
  {
    id: BUILT_IN_COMMANDS.FILE_SAVE,
    title: 'File: Save',
    description: 'Save the current file',
    category: 'file',
    keywords: ['file', 'save'],
    icon: 'save',
    priority: 95,
    keybinding: {
      key: 's',
      modifiers: ['ctrl'],
      displayText: 'Ctrl+S',
    },
    action: {
      id: BUILT_IN_COMMANDS.FILE_SAVE,
      execute: () => {
        console.log('Saving file...');
        // TODO: Implement file saving
      },
    },
  },
  {
    id: BUILT_IN_COMMANDS.FILE_SAVE_AS,
    title: 'File: Save As',
    description: 'Save the current file with a new name',
    category: 'file',
    keywords: ['file', 'save', 'as'],
    icon: 'save',
    priority: 70,
    keybinding: {
      key: 's',
      modifiers: ['ctrl', 'shift'],
      displayText: 'Ctrl+Shift+S',
    },
    action: {
      id: BUILT_IN_COMMANDS.FILE_SAVE_AS,
      execute: () => {
        console.log('Save as...');
        // TODO: Implement save as
      },
    },
  },
  {
    id: BUILT_IN_COMMANDS.FILE_CLOSE,
    title: 'File: Close',
    description: 'Close the current file',
    category: 'file',
    keywords: ['file', 'close'],
    icon: 'x',
    priority: 60,
    keybinding: {
      key: 'w',
      modifiers: ['ctrl'],
      displayText: 'Ctrl+W',
    },
    action: {
      id: BUILT_IN_COMMANDS.FILE_CLOSE,
      execute: () => {
        console.log('Closing file...');
        // TODO: Implement file closing
      },
    },
  },
];

/**
 * Edit operation commands
 */
const createEditCommands = (): Command[] => [
  {
    id: BUILT_IN_COMMANDS.EDIT_UNDO,
    title: 'Edit: Undo',
    description: 'Undo the last action',
    category: 'edit',
    keywords: ['edit', 'undo'],
    icon: 'undo',
    priority: 90,
    keybinding: {
      key: 'z',
      modifiers: ['ctrl'],
      displayText: 'Ctrl+Z',
    },
    action: {
      id: BUILT_IN_COMMANDS.EDIT_UNDO,
      execute: () => {
        console.log('Undo...');
        // TODO: Implement undo
      },
    },
  },
  {
    id: BUILT_IN_COMMANDS.EDIT_REDO,
    title: 'Edit: Redo',
    description: 'Redo the last undone action',
    category: 'edit',
    keywords: ['edit', 'redo'],
    icon: 'redo',
    priority: 85,
    keybinding: {
      key: 'y',
      modifiers: ['ctrl'],
      displayText: 'Ctrl+Y',
    },
    action: {
      id: BUILT_IN_COMMANDS.EDIT_REDO,
      execute: () => {
        console.log('Redo...');
        // TODO: Implement redo
      },
    },
  },
  {
    id: BUILT_IN_COMMANDS.EDIT_CUT,
    title: 'Edit: Cut',
    description: 'Cut selected text to clipboard',
    category: 'edit',
    keywords: ['edit', 'cut', 'clipboard'],
    icon: 'scissors',
    priority: 80,
    keybinding: {
      key: 'x',
      modifiers: ['ctrl'],
      displayText: 'Ctrl+X',
    },
    action: {
      id: BUILT_IN_COMMANDS.EDIT_CUT,
      execute: () => {
        console.log('Cut...');
        // TODO: Implement cut
      },
    },
  },
  {
    id: BUILT_IN_COMMANDS.EDIT_COPY,
    title: 'Edit: Copy',
    description: 'Copy selected text to clipboard',
    category: 'edit',
    keywords: ['edit', 'copy', 'clipboard'],
    icon: 'copy',
    priority: 85,
    keybinding: {
      key: 'c',
      modifiers: ['ctrl'],
      displayText: 'Ctrl+C',
    },
    action: {
      id: BUILT_IN_COMMANDS.EDIT_COPY,
      execute: () => {
        console.log('Copy...');
        // TODO: Implement copy
      },
    },
  },
  {
    id: BUILT_IN_COMMANDS.EDIT_PASTE,
    title: 'Edit: Paste',
    description: 'Paste text from clipboard',
    category: 'edit',
    keywords: ['edit', 'paste', 'clipboard'],
    icon: 'clipboard',
    priority: 85,
    keybinding: {
      key: 'v',
      modifiers: ['ctrl'],
      displayText: 'Ctrl+V',
    },
    action: {
      id: BUILT_IN_COMMANDS.EDIT_PASTE,
      execute: () => {
        console.log('Paste...');
        // TODO: Implement paste
      },
    },
  },
];

/**
 * View commands
 */
const createViewCommands = (): Command[] => [
  {
    id: BUILT_IN_COMMANDS.VIEW_COMMAND_PALETTE,
    title: 'View: Show Command Palette',
    description: 'Show the command palette',
    category: 'view',
    keywords: ['view', 'command', 'palette', 'show'],
    icon: 'terminal',
    priority: 100,
    keybinding: {
      key: 'p',
      modifiers: ['ctrl', 'shift'],
      displayText: 'Ctrl+Shift+P',
    },
    action: {
      id: BUILT_IN_COMMANDS.VIEW_COMMAND_PALETTE,
      execute: () => {
        const event = new CustomEvent('codeforge:showCommandPalette');
        window.dispatchEvent(event);
      },
    },
  },
  {
    id: BUILT_IN_COMMANDS.VIEW_EXPLORER,
    title: 'View: Show Explorer',
    description: 'Show the file explorer panel',
    category: 'view',
    keywords: ['view', 'explorer', 'files', 'show'],
    icon: 'folder',
    priority: 75,
    keybinding: {
      key: 'e',
      modifiers: ['ctrl', 'shift'],
      displayText: 'Ctrl+Shift+E',
    },
    action: {
      id: BUILT_IN_COMMANDS.VIEW_EXPLORER,
      execute: () => {
        console.log('Show explorer...');
        // TODO: Implement explorer toggle
      },
    },
  },
  {
    id: BUILT_IN_COMMANDS.VIEW_SEARCH,
    title: 'View: Show Search',
    description: 'Show the search panel',
    category: 'view',
    keywords: ['view', 'search', 'find', 'show'],
    icon: 'search',
    priority: 75,
    keybinding: {
      key: 'f',
      modifiers: ['ctrl', 'shift'],
      displayText: 'Ctrl+Shift+F',
    },
    action: {
      id: BUILT_IN_COMMANDS.VIEW_SEARCH,
      execute: () => {
        console.log('Show search...');
        // TODO: Implement search toggle
      },
    },
  },
  {
    id: BUILT_IN_COMMANDS.VIEW_SOURCE_CONTROL,
    title: 'View: Show Source Control',
    description: 'Show the source control panel',
    category: 'view',
    keywords: ['view', 'source', 'control', 'git', 'show'],
    icon: 'git-branch',
    priority: 70,
    keybinding: {
      key: 'g',
      modifiers: ['ctrl', 'shift'],
      displayText: 'Ctrl+Shift+G',
    },
    action: {
      id: BUILT_IN_COMMANDS.VIEW_SOURCE_CONTROL,
      execute: () => {
        console.log('Show source control...');
        // TODO: Implement source control toggle
      },
    },
  },
  {
    id: BUILT_IN_COMMANDS.VIEW_TERMINAL,
    title: 'View: Show Terminal',
    description: 'Show the integrated terminal',
    category: 'view',
    keywords: ['view', 'terminal', 'console', 'show'],
    icon: 'terminal',
    priority: 80,
    keybinding: {
      key: '`',
      modifiers: ['ctrl'],
      displayText: 'Ctrl+`',
    },
    action: {
      id: BUILT_IN_COMMANDS.VIEW_TERMINAL,
      execute: () => {
        console.log('Show terminal...');
        // TODO: Implement terminal toggle
      },
    },
  },
];

/**
 * General commands
 */
const createGeneralCommands = (): Command[] => [
  {
    id: BUILT_IN_COMMANDS.GENERAL_RELOAD,
    title: 'Developer: Reload Window',
    description: 'Reload the CodeForge window',
    category: 'general',
    keywords: ['reload', 'refresh', 'restart'],
    icon: 'refresh-cw',
    priority: 50,
    keybinding: {
      key: 'r',
      modifiers: ['ctrl', 'shift'],
      displayText: 'Ctrl+Shift+R',
    },
    action: {
      id: BUILT_IN_COMMANDS.GENERAL_RELOAD,
      execute: () => {
        window.location.reload();
      },
    },
  },
  {
    id: BUILT_IN_COMMANDS.GENERAL_SETTINGS,
    title: 'Preferences: Open Settings',
    description: 'Open the settings page',
    category: 'general',
    keywords: ['settings', 'preferences', 'config'],
    icon: 'settings',
    priority: 60,
    keybinding: {
      key: ',',
      modifiers: ['ctrl'],
      displayText: 'Ctrl+,',
    },
    action: {
      id: BUILT_IN_COMMANDS.GENERAL_SETTINGS,
      execute: () => {
        console.log('Open settings...');
        // TODO: Implement settings page
      },
    },
  },
];

/**
 * Get all built-in commands
 */
export const getAllBuiltInCommands = (): Command[] => [
  ...createThemeCommands(),
  ...createFileCommands(),
  ...createEditCommands(),
  ...createViewCommands(),
  ...createGeneralCommands(),
];

/**
 * Get commands by category
 */
export const getBuiltInCommandsByCategory = (category: string): Command[] => {
  return getAllBuiltInCommands().filter(cmd => cmd.category === category);
};

/**
 * Get theme-specific commands
 */
export const getThemeCommands = (): Command[] => createThemeCommands();

/**
 * Initialize built-in commands with the command registry
 */
export const initializeBuiltInCommands = (commandRegistry: any) => {
  const commands = getAllBuiltInCommands();
  commandRegistry.registerAll(commands);

  console.log(`Registered ${commands.length} built-in commands`);
};
