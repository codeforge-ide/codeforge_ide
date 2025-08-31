/**
 * @fileoverview Keyboard shortcut manager for CodeForge IDE
 * @module components/commands/KeyboardManager
 * @version 1.0.0
 * @author CodeForge Team
 *
 * @description
 * Manages keyboard shortcuts, handles key combinations, and dispatches
 * command execution based on registered keybindings.
 */

import { KeyboardShortcut, KeyModifier } from './types';
import { commandRegistry } from './CommandRegistry';

interface KeyboardEvent {
  key: string;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  metaKey: boolean;
  preventDefault: () => void;
  stopPropagation: () => void;
}

interface KeyBinding {
  shortcut: KeyboardShortcut;
  commandId: string;
  when?: () => boolean;
}

/**
 * Keyboard shortcut manager class
 */
class KeyboardManagerImpl {
  private keyBindings = new Map<string, KeyBinding>();
  private listeners = new Set<(event: KeyboardEvent) => void>();
  private isEnabled = true;

  constructor() {
    this.bindGlobalKeyHandler();
  }

  /**
   * Register a keyboard shortcut
   */
  registerShortcut(commandId: string, shortcut: KeyboardShortcut, when?: () => boolean): void {
    const key = this.generateShortcutKey(shortcut);

    if (this.keyBindings.has(key)) {
      console.warn(`Keyboard shortcut "${key}" is already registered`);
      return;
    }

    this.keyBindings.set(key, {
      shortcut,
      commandId,
      when,
    });
  }

  /**
   * Unregister a keyboard shortcut
   */
  unregisterShortcut(shortcut: KeyboardShortcut): void {
    const key = this.generateShortcutKey(shortcut);
    this.keyBindings.delete(key);
  }

  /**
   * Register multiple shortcuts from commands
   */
  registerCommandShortcuts(): void {
    const commands = commandRegistry.getAll();

    commands.forEach(command => {
      if (command.keybinding) {
        this.registerShortcut(command.id, command.keybinding);
      }
    });
  }

  /**
   * Generate unique key for shortcut
   */
  private generateShortcutKey(shortcut: KeyboardShortcut): string {
    const modifiers = shortcut.modifiers || [];
    const sortedModifiers = [...modifiers].sort();
    return `${sortedModifiers.join('+')}+${shortcut.key.toLowerCase()}`;
  }

  /**
   * Check if keyboard event matches shortcut
   */
  private matchesShortcut(event: KeyboardEvent, shortcut: KeyboardShortcut): boolean {
    const modifiers = shortcut.modifiers || [];

    // Check if key matches (case insensitive)
    if (event.key.toLowerCase() !== shortcut.key.toLowerCase()) {
      return false;
    }

    // Check required modifiers
    const hasCtrl = modifiers.includes('ctrl');
    const hasShift = modifiers.includes('shift');
    const hasAlt = modifiers.includes('alt');
    const hasMeta = modifiers.includes('meta');

    // Check if event modifiers match exactly
    return (
      event.ctrlKey === hasCtrl &&
      event.shiftKey === hasShift &&
      event.altKey === hasAlt &&
      event.metaKey === hasMeta
    );
  }

  /**
   * Handle keyboard events
   */
  private handleKeyDown = (event: globalThis.KeyboardEvent): void => {
    if (!this.isEnabled) {
      return;
    }

    // Don't handle shortcuts when typing in inputs, textareas, or contenteditable
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      return;
    }

    // Find matching keybinding
    for (const [, binding] of this.keyBindings) {
      if (this.matchesShortcut(event, binding.shortcut)) {
        // Check conditional execution
        if (binding.when && !binding.when()) {
          continue;
        }

        event.preventDefault();
        event.stopPropagation();

        // Execute command
        commandRegistry.executeCommand(binding.commandId, undefined, 'keyboard')
          .catch(error => {
            console.error(`Failed to execute command "${binding.commandId}":`, error);
          });

        return;
      }
    }

    // Notify custom listeners
    this.listeners.forEach(listener => {
      try {
        listener(event as KeyboardEvent);
      } catch (error) {
        console.error('Keyboard listener error:', error);
      }
    });
  };

  /**
   * Bind global keyboard event handler
   */
  private bindGlobalKeyHandler(): void {
    document.addEventListener('keydown', this.handleKeyDown, true);
  }

  /**
   * Remove global keyboard event handler
   */
  private unbindGlobalKeyHandler(): void {
    document.removeEventListener('keydown', this.handleKeyDown, true);
  }

  /**
   * Add custom keyboard event listener
   */
  addListener(listener: (event: KeyboardEvent) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Enable keyboard shortcuts
   */
  enable(): void {
    this.isEnabled = true;
  }

  /**
   * Disable keyboard shortcuts
   */
  disable(): void {
    this.isEnabled = false;
  }

  /**
   * Check if keyboard shortcuts are enabled
   */
  isKeyboardEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Get all registered shortcuts
   */
  getAllShortcuts(): Array<{ shortcut: KeyboardShortcut; commandId: string }> {
    return Array.from(this.keyBindings.values()).map(binding => ({
      shortcut: binding.shortcut,
      commandId: binding.commandId,
    }));
  }

  /**
   * Get shortcut for command
   */
  getShortcutForCommand(commandId: string): KeyboardShortcut | undefined {
    for (const binding of this.keyBindings.values()) {
      if (binding.commandId === commandId) {
        return binding.shortcut;
      }
    }
    return undefined;
  }

  /**
   * Check if shortcut is available
   */
  isShortcutAvailable(shortcut: KeyboardShortcut): boolean {
    const key = this.generateShortcutKey(shortcut);
    return !this.keyBindings.has(key);
  }

  /**
   * Get human-readable shortcut text
   */
  getShortcutDisplayText(shortcut: KeyboardShortcut): string {
    if (shortcut.displayText) {
      return shortcut.displayText;
    }

    const modifiers = shortcut.modifiers || [];
    const parts: string[] = [];

    // Add modifiers in standard order
    if (modifiers.includes('ctrl')) parts.push('Ctrl');
    if (modifiers.includes('meta')) parts.push('Cmd');
    if (modifiers.includes('alt')) parts.push('Alt');
    if (modifiers.includes('shift')) parts.push('Shift');

    // Add key
    parts.push(this.formatKey(shortcut.key));

    return parts.join('+');
  }

  /**
   * Format key for display
   */
  private formatKey(key: string): string {
    const keyMap: Record<string, string> = {
      ' ': 'Space',
      'ArrowUp': '↑',
      'ArrowDown': '↓',
      'ArrowLeft': '←',
      'ArrowRight': '→',
      'Enter': '↵',
      'Escape': 'Esc',
      'Backspace': '⌫',
      'Delete': 'Del',
      'Tab': '⇥',
      '`': '`',
    };

    return keyMap[key] || key.toUpperCase();
  }

  /**
   * Clear all registered shortcuts
   */
  clear(): void {
    this.keyBindings.clear();
  }

  /**
   * Destroy the keyboard manager
   */
  destroy(): void {
    this.unbindGlobalKeyHandler();
    this.keyBindings.clear();
    this.listeners.clear();
  }
}

// Global keyboard manager instance
export const keyboardManager = new KeyboardManagerImpl();

// Export types
export type { KeyboardEvent, KeyBinding };
