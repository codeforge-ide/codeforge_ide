/**
 * @fileoverview Command provider for integrating command system in CodeForge IDE
 * @module components/commands/CommandProvider
 * @version 1.0.0
 * @author CodeForge Team
 *
 * @description
 * Provides command system context to the application, manages command palette state,
 * integrates keyboard shortcuts, and handles theme command events.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CommandPaletteState, CommandPaletteActions } from './types';
import { commandRegistry } from './CommandRegistry';
import { keyboardManager } from './KeyboardManager';
import { getAllBuiltInCommands } from './builtInCommands';
import { useTheme } from '../../themes/ThemeProvider';
import CommandPalette from './CommandPalette';

interface CommandContextValue extends CommandPaletteState, CommandPaletteActions {
  commandRegistry: typeof commandRegistry;
  keyboardManager: typeof keyboardManager;
}

const CommandContext = createContext<CommandContextValue | undefined>(undefined);

interface CommandProviderProps {
  children: React.ReactNode;
}

/**
 * Command provider component that manages the command system
 */
export const CommandProvider: React.FC<CommandProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filteredCommands, setFilteredCommands] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { setTheme, toggleTheme } = useTheme();

  // Initialize command system
  useEffect(() => {
    // Register built-in commands
    const commands = getAllBuiltInCommands();
    commandRegistry.registerAll(commands);

    // Register keyboard shortcuts
    keyboardManager.registerCommandShortcuts();

    console.log('Command system initialized');

    return () => {
      commandRegistry.clear();
      keyboardManager.clear();
    };
  }, []);

  // Handle theme-related custom events
  useEffect(() => {
    const handleSetTheme = (event: CustomEvent) => {
      const { themeId } = event.detail;
      setTheme(themeId);
    };

    const handleToggleTheme = () => {
      toggleTheme();
    };

    const handleShowCommandPalette = () => {
      openPalette();
    };

    const handleShowThemeSelector = () => {
      openPalette();
      setQuery('theme:');
    };

    // Listen for theme events
    window.addEventListener('codeforge:setTheme', handleSetTheme as EventListener);
    window.addEventListener('codeforge:toggleTheme', handleToggleTheme);
    window.addEventListener('codeforge:showCommandPalette', handleShowCommandPalette);
    window.addEventListener('codeforge:showThemeSelector', handleShowThemeSelector);

    return () => {
      window.removeEventListener('codeforge:setTheme', handleSetTheme as EventListener);
      window.removeEventListener('codeforge:toggleTheme', handleToggleTheme);
      window.removeEventListener('codeforge:showCommandPalette', handleShowCommandPalette);
      window.removeEventListener('codeforge:showThemeSelector', handleShowThemeSelector);
    };
  }, [setTheme, toggleTheme]);

  // Command palette actions
  const openPalette = useCallback(() => {
    setIsOpen(true);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  const closePalette = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
    setFilteredCommands([]);
  }, []);

  const updateQuery = useCallback((newQuery: string) => {
    setQuery(newQuery);
    setSelectedIndex(0);
  }, []);

  const selectNext = useCallback(() => {
    setSelectedIndex(prev =>
      Math.min(prev + 1, filteredCommands.length - 1)
    );
  }, [filteredCommands.length]);

  const selectPrevious = useCallback(() => {
    setSelectedIndex(prev => Math.max(prev - 1, 0));
  }, []);

  const executeSelected = useCallback(async () => {
    const selectedCommand = filteredCommands[selectedIndex];
    if (selectedCommand) {
      try {
        await commandRegistry.executeCommand(selectedCommand.id, undefined, 'palette');
        closePalette();
      } catch (error) {
        console.error('Failed to execute selected command:', error);
      }
    }
  }, [filteredCommands, selectedIndex, closePalette]);

  const executeCommand = useCallback(async (commandId: string, args?: any) => {
    try {
      await commandRegistry.executeCommand(commandId, args, 'programmatic');
    } catch (error) {
      console.error(`Failed to execute command "${commandId}":`, error);
    }
  }, []);

  // Update filtered commands when query changes
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);

      // Debounce search to improve performance
      const timeoutId = setTimeout(() => {
        const commands = commandRegistry.search(query);
        setFilteredCommands(commands);
        setSelectedIndex(0);
        setIsLoading(false);
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [query, isOpen]);

  // Context value
  const contextValue: CommandContextValue = {
    // State
    isOpen,
    query,
    selectedIndex,
    filteredCommands,
    isLoading,

    // Actions
    openPalette,
    closePalette,
    setQuery: updateQuery,
    selectNext,
    selectPrevious,
    executeSelected,
    executeCommand,

    // Registries
    commandRegistry,
    keyboardManager,
  };

  return (
    <CommandContext.Provider value={contextValue}>
      {children}
      <CommandPalette
        isOpen={isOpen}
        onClose={closePalette}
        maxResults={50}
        placeholder="Type a command or search..."
      />
    </CommandContext.Provider>
  );
};

/**
 * Hook to access command context
 */
export const useCommands = (): CommandContextValue => {
  const context = useContext(CommandContext);

  if (context === undefined) {
    throw new Error('useCommands must be used within a CommandProvider');
  }

  return context;
};

/**
 * Hook to access command palette state
 */
export const useCommandPalette = () => {
  const {
    isOpen,
    query,
    selectedIndex,
    filteredCommands,
    isLoading,
    openPalette,
    closePalette,
    setQuery,
    selectNext,
    selectPrevious,
    executeSelected,
  } = useCommands();

  return {
    isOpen,
    query,
    selectedIndex,
    filteredCommands,
    isLoading,
    openPalette,
    closePalette,
    setQuery,
    selectNext,
    selectPrevious,
    executeSelected,
  };
};

/**
 * Hook to execute commands programmatically
 */
export const useCommandExecution = () => {
  const { executeCommand, commandRegistry } = useCommands();

  return {
    executeCommand,
    getAllCommands: () => commandRegistry.getAll(),
    getCommand: (id: string) => commandRegistry.get(id),
    getCommandsByCategory: (category: string) => commandRegistry.getByCategory(category as any),
    searchCommands: (query: string) => commandRegistry.search(query),
  };
};

/**
 * Hook to manage keyboard shortcuts
 */
export const useKeyboardShortcuts = () => {
  const { keyboardManager } = useCommands();

  return {
    registerShortcut: keyboardManager.registerShortcut.bind(keyboardManager),
    unregisterShortcut: keyboardManager.unregisterShortcut.bind(keyboardManager),
    getAllShortcuts: keyboardManager.getAllShortcuts.bind(keyboardManager),
    getShortcutForCommand: keyboardManager.getShortcutForCommand.bind(keyboardManager),
    getShortcutDisplayText: keyboardManager.getShortcutDisplayText.bind(keyboardManager),
    isShortcutAvailable: keyboardManager.isShortcutAvailable.bind(keyboardManager),
    enable: keyboardManager.enable.bind(keyboardManager),
    disable: keyboardManager.disable.bind(keyboardManager),
  };
};

export default CommandProvider;
