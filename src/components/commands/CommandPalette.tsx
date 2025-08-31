/**
 * @fileoverview Command palette component for CodeForge IDE
 * @module components/commands/CommandPalette
 * @version 1.0.0
 * @author CodeForge Team
 *
 * @description
 * Main command palette component that provides search functionality,
 * command execution, and keyboard navigation for all IDE commands.
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Command, CommandPaletteProps } from './types';
import { commandRegistry } from './CommandRegistry';
import { useTheme } from '../../themes/ThemeProvider';
import './CommandPalette.css';

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  className = '',
  maxResults = 50,
  placeholder = 'Type a command...',
  categories,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filteredCommands, setFilteredCommands] = useState<Command[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { currentTheme } = useTheme();

  // Filter commands based on query and categories
  const searchCommands = useCallback((searchQuery: string) => {
    setIsLoading(true);

    // Use setTimeout to make search feel more responsive for large command sets
    setTimeout(() => {
      let commands = commandRegistry.search(searchQuery);

      // Filter by categories if specified
      if (categories && categories.length > 0) {
        commands = commands.filter(cmd => categories.includes(cmd.category));
      }

      // Limit results
      commands = commands.slice(0, maxResults);

      setFilteredCommands(commands);
      setSelectedIndex(0);
      setIsLoading(false);
    }, 50);
  }, [categories, maxResults]);

  // Update filtered commands when query changes
  useEffect(() => {
    searchCommands(query);
  }, [query, searchCommands]);

  // Focus input when palette opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isOpen]);

  // Reset state when palette closes
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setFilteredCommands([]);
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        onClose();
        break;

      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          Math.min(prev + 1, filteredCommands.length - 1)
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;

      case 'Enter':
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          executeCommand(filteredCommands[selectedIndex]);
        }
        break;

      case 'Tab':
        e.preventDefault();
        if (e.shiftKey) {
          setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else {
          setSelectedIndex(prev =>
            Math.min(prev + 1, filteredCommands.length - 1)
          );
        }
        break;
    }
  }, [filteredCommands, selectedIndex, onClose]);

  // Execute selected command
  const executeCommand = useCallback(async (command: Command) => {
    try {
      await commandRegistry.executeCommand(command.id, undefined, 'palette');
      onClose();
    } catch (error) {
      console.error('Failed to execute command:', error);
      // TODO: Show error notification
    }
  }, [onClose]);

  // Handle command item click
  const handleCommandClick = useCallback((command: Command, index: number) => {
    setSelectedIndex(index);
    executeCommand(command);
  }, [executeCommand]);

  // Handle command item mouse enter
  const handleCommandMouseEnter = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current && filteredCommands.length > 0) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        });
      }
    }
  }, [selectedIndex, filteredCommands]);

  // Get command icon
  const getCommandIcon = useCallback((command: Command) => {
    // TODO: Implement icon system
    return command.icon || '⚡';
  }, []);

  // Get command category color
  const getCategoryColor = useCallback((category: string) => {
    const categoryColors: Record<string, string> = {
      theme: currentTheme.colors.syntax.keyword,
      file: currentTheme.colors.syntax.string,
      edit: currentTheme.colors.syntax.function,
      view: currentTheme.colors.syntax.type,
      search: currentTheme.colors.syntax.variable,
      git: currentTheme.colors.git.modified,
      terminal: currentTheme.colors.terminal.green,
      debug: currentTheme.colors.status.error,
      help: currentTheme.colors.syntax.comment,
      extension: currentTheme.colors.interactive.accent,
      general: currentTheme.colors.foreground.secondary,
    };

    return categoryColors[category] || currentTheme.colors.foreground.tertiary;
  }, [currentTheme]);

  // Render command item
  const renderCommandItem = useCallback((command: Command, index: number) => {
    const isSelected = index === selectedIndex;
    const categoryColor = getCategoryColor(command.category);

    return (
      <div
        key={command.id}
        className={`command-item ${isSelected ? 'selected' : ''}`}
        onClick={() => handleCommandClick(command, index)}
        onMouseEnter={() => handleCommandMouseEnter(index)}
        role="option"
        aria-selected={isSelected}
      >
        <div className="command-icon">
          {getCommandIcon(command)}
        </div>

        <div className="command-content">
          <div className="command-title">
            {command.title}
          </div>

          {command.description && (
            <div className="command-description">
              {command.description}
            </div>
          )}
        </div>

        <div className="command-meta">
          <div
            className="command-category"
            style={{ color: categoryColor }}
          >
            {command.category}
          </div>

          {command.keybinding && (
            <div className="command-keybinding">
              {command.keybinding.displayText ||
                `${command.keybinding.modifiers?.join('+') || ''}${
                  command.keybinding.modifiers ? '+' : ''
                }${command.keybinding.key}`
              }
            </div>
          )}
        </div>
      </div>
    );
  }, [selectedIndex, getCategoryColor, getCommandIcon, handleCommandClick, handleCommandMouseEnter]);

  // Don't render if not open
  if (!isOpen) {
    return null;
  }

  return (
    <div className={`command-palette-overlay ${className}`} onClick={onClose}>
      <div
        className="command-palette"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette"
      >
        <div className="command-search">
          <div className="search-icon">🔍</div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="search-input"
            autoComplete="off"
            spellCheck="false"
          />
          {isLoading && (
            <div className="search-loading">
              <div className="loading-spinner" />
            </div>
          )}
        </div>

        <div className="command-results">
          {filteredCommands.length > 0 ? (
            <div
              ref={listRef}
              className="command-list"
              role="listbox"
              aria-label="Commands"
            >
              {filteredCommands.map((command, index) =>
                renderCommandItem(command, index)
              )}
            </div>
          ) : query.trim() ? (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <div className="no-results-text">
                No commands found for "{query}"
              </div>
              <div className="no-results-hint">
                Try a different search term or check your spelling
              </div>
            </div>
          ) : (
            <div className="command-help">
              <div className="help-title">Quick Commands</div>
              <div className="help-shortcuts">
                <div className="help-shortcut">
                  <span className="help-key">Ctrl+Shift+P</span>
                  <span className="help-desc">Open Command Palette</span>
                </div>
                <div className="help-shortcut">
                  <span className="help-key">Ctrl+P</span>
                  <span className="help-desc">Quick Open File</span>
                </div>
                <div className="help-shortcut">
                  <span className="help-key">Ctrl+Shift+T</span>
                  <span className="help-desc">Select Theme</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="command-footer">
          <div className="footer-navigation">
            <span className="footer-hint">↑↓ Navigate</span>
            <span className="footer-hint">↵ Select</span>
            <span className="footer-hint">Esc Close</span>
          </div>

          {filteredCommands.length > 0 && (
            <div className="footer-count">
              {selectedIndex + 1} of {filteredCommands.length}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
