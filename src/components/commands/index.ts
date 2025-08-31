/**
 * @fileoverview Commands module exports for CodeForge IDE
 * @module components/commands
 * @version 1.0.0
 * @author CodeForge Team
 *
 * @description
 * Exports all command system components, types, and utilities for use
 * throughout the CodeForge IDE application.
 */

// Main components
export {
  CommandProvider,
  default as CommandProviderDefault,
} from "./CommandProvider";
export { default as CommandPalette } from "./CommandPalette";

// Hooks
export {
  useCommands,
  useCommandPalette,
  useCommandExecution,
  useKeyboardShortcuts,
} from "./CommandProvider";

// Core services
export { commandRegistry } from "./CommandRegistry";
export { keyboardManager } from "./KeyboardManager";

// Built-in commands
export {
  getAllBuiltInCommands,
  getBuiltInCommandsByCategory,
  getThemeCommands,
  initializeBuiltInCommands,
} from "./builtInCommands";

// Types and interfaces
export type {
  Command,
  CommandCategory,
  CommandAction,
  CommandPaletteState,
  CommandPaletteActions,
  CommandPaletteProps,
  CommandPaletteItemProps,
  CommandRegistry,
  CommandRegistration,
  CommandExecutionContext,
  CommandHistory,
  KeyboardShortcut,
  KeyModifier,
  QuickPickItem,
  QuickPickOptions,
  BuiltInCommandId,
} from "./types";

export { BUILT_IN_COMMANDS } from "./types";

// Re-export history implementation
export { CommandHistoryImpl } from "./CommandRegistry";
export type { KeyBinding } from "./KeyboardManager";
