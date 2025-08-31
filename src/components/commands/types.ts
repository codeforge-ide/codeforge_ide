/**
 * @fileoverview Command system types and interfaces for CodeForge IDE
 * @module components/commands/types
 * @version 1.0.0
 * @author CodeForge Team
 *
 * @description
 * Defines types for the command palette system including command definitions,
 * keyboard shortcuts, command categories, and command execution contexts.
 */

export type CommandCategory =
  | 'theme'
  | 'file'
  | 'edit'
  | 'view'
  | 'search'
  | 'git'
  | 'terminal'
  | 'debug'
  | 'help'
  | 'extension'
  | 'general';

export type KeyModifier = 'ctrl' | 'shift' | 'alt' | 'meta';

export interface KeyboardShortcut {
  key: string;                    // Primary key (e.g., 'p', 'Enter', 'Escape')
  modifiers?: KeyModifier[];      // Modifier keys
  displayText?: string;           // Human-readable shortcut text
}

export interface CommandAction {
  id: string;                     // Unique command identifier
  execute: (args?: any) => void | Promise<void>; // Command execution function
  canExecute?: () => boolean;     // Optional condition check
}

export interface Command {
  id: string;                     // Unique command identifier
  title: string;                  // Display title
  description?: string;           // Optional description
  category: CommandCategory;      // Command category
  keywords?: string[];            // Search keywords
  icon?: string;                  // Optional icon name
  keybinding?: KeyboardShortcut;  // Keyboard shortcut
  action: CommandAction;          // Command action
  when?: string;                  // Conditional expression
  priority?: number;              // Search priority (higher = more important)
  hidden?: boolean;               // Hide from command palette
}

export interface CommandPaletteState {
  isOpen: boolean;                // Is command palette open
  query: string;                  // Current search query
  selectedIndex: number;          // Selected command index
  filteredCommands: Command[];    // Filtered command list
  isLoading: boolean;             // Loading state
}

export interface CommandPaletteActions {
  openPalette: () => void;        // Open command palette
  closePalette: () => void;       // Close command palette
  setQuery: (query: string) => void; // Set search query
  selectNext: () => void;         // Select next command
  selectPrevious: () => void;     // Select previous command
  executeSelected: () => void;    // Execute selected command
  executeCommand: (commandId: string, args?: any) => void; // Execute specific command
}

export interface CommandRegistration {
  id: string;                     // Command ID
  command: Omit<Command, 'id'>;   // Command definition without ID
}

export interface CommandRegistry {
  commands: Map<string, Command>; // Registered commands
  register: (command: Command) => void; // Register command
  unregister: (commandId: string) => void; // Unregister command
  get: (commandId: string) => Command | undefined; // Get command by ID
  getAll: () => Command[];        // Get all commands
  getByCategory: (category: CommandCategory) => Command[]; // Get commands by category
  search: (query: string) => Command[]; // Search commands
}

export interface CommandExecutionContext {
  commandId: string;              // Executed command ID
  timestamp: number;              // Execution timestamp
  source: 'palette' | 'keyboard' | 'menu' | 'programmatic'; // Execution source
  args?: any;                     // Command arguments
}

export interface CommandHistory {
  entries: CommandExecutionContext[]; // Command history
  maxEntries: number;             // Maximum history entries
  add: (context: CommandExecutionContext) => void; // Add to history
  clear: () => void;              // Clear history
  getRecent: (count?: number) => CommandExecutionContext[]; // Get recent commands
}

export interface QuickPickItem {
  id: string;                     // Unique identifier
  label: string;                  // Display label
  description?: string;           // Optional description
  detail?: string;                // Additional detail text
  icon?: string;                  // Optional icon
  group?: string;                 // Optional grouping
  data?: any;                     // Additional data
}

export interface QuickPickOptions {
  title?: string;                 // Quick pick title
  placeholder?: string;           // Input placeholder
  canSelectMany?: boolean;        // Allow multiple selection
  ignoreFocusOut?: boolean;       // Keep open when focus lost
  matchOnDescription?: boolean;   // Match on description text
  matchOnDetail?: boolean;        // Match on detail text
}

export interface CommandPaletteProps {
  isOpen: boolean;                // Is palette open
  onClose: () => void;            // Close handler
  className?: string;             // Additional CSS classes
  maxResults?: number;            // Maximum results to show
  placeholder?: string;           // Search placeholder
  categories?: CommandCategory[]; // Visible categories
}

export interface CommandPaletteItemProps {
  command: Command;               // Command to display
  isSelected: boolean;            // Is item selected
  onClick: () => void;            // Click handler
  onMouseEnter: () => void;       // Mouse enter handler
}

// Built-in command IDs
export const BUILT_IN_COMMANDS = {
  // Theme commands
  THEME_SELECT: 'theme.select',
  THEME_TOGGLE: 'theme.toggle',
  THEME_PITCH_DARK: 'theme.pitchDark',
  THEME_DARK: 'theme.dark',
  THEME_LIGHT: 'theme.light',
  THEME_HIGH_CONTRAST: 'theme.highContrast',

  // File commands
  FILE_NEW: 'file.new',
  FILE_OPEN: 'file.open',
  FILE_SAVE: 'file.save',
  FILE_SAVE_AS: 'file.saveAs',
  FILE_CLOSE: 'file.close',

  // Edit commands
  EDIT_UNDO: 'edit.undo',
  EDIT_REDO: 'edit.redo',
  EDIT_CUT: 'edit.cut',
  EDIT_COPY: 'edit.copy',
  EDIT_PASTE: 'edit.paste',

  // View commands
  VIEW_COMMAND_PALETTE: 'view.commandPalette',
  VIEW_EXPLORER: 'view.explorer',
  VIEW_SEARCH: 'view.search',
  VIEW_SOURCE_CONTROL: 'view.sourceControl',
  VIEW_TERMINAL: 'view.terminal',

  // General commands
  GENERAL_RELOAD: 'general.reload',
  GENERAL_QUIT: 'general.quit',
  GENERAL_SETTINGS: 'general.settings',
} as const;

export type BuiltInCommandId = typeof BUILT_IN_COMMANDS[keyof typeof BUILT_IN_COMMANDS];
