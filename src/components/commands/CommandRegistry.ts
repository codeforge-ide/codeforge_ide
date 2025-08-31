/**
 * @fileoverview Command registry for managing and executing commands in CodeForge IDE
 * @module components/commands/CommandRegistry
 * @version 1.0.0
 * @author CodeForge Team
 *
 * @description
 * Centralized registry for managing commands, keyboard shortcuts, and command execution.
 * Provides search functionality and command filtering capabilities.
 */

import {
  Command,
  CommandCategory,
  CommandRegistry as ICommandRegistry,
  CommandExecutionContext,
  CommandHistory,
  BUILT_IN_COMMANDS,
} from './types';

/**
 * Command history implementation
 */
class CommandHistoryImpl implements CommandHistory {
  public entries: CommandExecutionContext[] = [];
  public readonly maxEntries: number = 100;

  add(context: CommandExecutionContext): void {
    this.entries.unshift(context);
    if (this.entries.length > this.maxEntries) {
      this.entries = this.entries.slice(0, this.maxEntries);
    }
  }

  clear(): void {
    this.entries = [];
  }

  getRecent(count: number = 10): CommandExecutionContext[] {
    return this.entries.slice(0, count);
  }
}

/**
 * Command registry implementation
 */
class CommandRegistryImpl implements ICommandRegistry {
  public commands = new Map<string, Command>();
  public history = new CommandHistoryImpl();
  private listeners = new Set<(command: Command, args?: any) => void>();

  /**
   * Register a new command
   */
  register(command: Command): void {
    if (this.commands.has(command.id)) {
      console.warn(`Command with ID "${command.id}" is already registered`);
      return;
    }

    this.commands.set(command.id, command);
  }

  /**
   * Register multiple commands at once
   */
  registerAll(commands: Command[]): void {
    commands.forEach(command => this.register(command));
  }

  /**
   * Unregister a command
   */
  unregister(commandId: string): void {
    this.commands.delete(commandId);
  }

  /**
   * Get a command by ID
   */
  get(commandId: string): Command | undefined {
    return this.commands.get(commandId);
  }

  /**
   * Get all registered commands
   */
  getAll(): Command[] {
    return Array.from(this.commands.values())
      .filter(command => !command.hidden)
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }

  /**
   * Get commands by category
   */
  getByCategory(category: CommandCategory): Command[] {
    return this.getAll().filter(command => command.category === category);
  }

  /**
   * Search commands by query
   */
  search(query: string): Command[] {
    if (!query.trim()) {
      return this.getAll();
    }

    const normalizedQuery = query.toLowerCase().trim();
    const results: Array<{ command: Command; score: number }> = [];

    for (const command of this.commands.values()) {
      if (command.hidden) continue;

      let score = 0;
      const title = command.title.toLowerCase();
      const description = command.description?.toLowerCase() || '';
      const keywords = command.keywords?.join(' ').toLowerCase() || '';

      // Exact title match gets highest score
      if (title === normalizedQuery) {
        score += 100;
      }
      // Title starts with query
      else if (title.startsWith(normalizedQuery)) {
        score += 80;
      }
      // Title contains query
      else if (title.includes(normalizedQuery)) {
        score += 60;
      }

      // Description matches
      if (description.includes(normalizedQuery)) {
        score += 40;
      }

      // Keywords match
      if (keywords.includes(normalizedQuery)) {
        score += 30;
      }

      // Category matches
      if (command.category.toLowerCase().includes(normalizedQuery)) {
        score += 20;
      }

      // Fuzzy matching for partial matches
      if (score === 0) {
        const fuzzyScore = this.calculateFuzzyScore(normalizedQuery, title);
        if (fuzzyScore > 0.5) {
          score = Math.floor(fuzzyScore * 20);
        }
      }

      if (score > 0) {
        results.push({ command, score });
      }
    }

    return results
      .sort((a, b) => {
        // Sort by score first, then by priority, then alphabetically
        if (a.score !== b.score) return b.score - a.score;
        if ((a.command.priority || 0) !== (b.command.priority || 0)) {
          return (b.command.priority || 0) - (a.command.priority || 0);
        }
        return a.command.title.localeCompare(b.command.title);
      })
      .map(result => result.command);
  }

  /**
   * Execute a command by ID
   */
  async executeCommand(commandId: string, args?: any, source: CommandExecutionContext['source'] = 'programmatic'): Promise<void> {
    const command = this.get(commandId);
    if (!command) {
      console.error(`Command with ID "${commandId}" not found`);
      return;
    }

    // Check if command can be executed
    if (command.action.canExecute && !command.action.canExecute()) {
      console.warn(`Command "${commandId}" cannot be executed at this time`);
      return;
    }

    // Create execution context
    const context: CommandExecutionContext = {
      commandId,
      timestamp: Date.now(),
      source,
      args,
    };

    try {
      // Execute the command
      await command.action.execute(args);

      // Add to history
      this.history.add(context);

      // Notify listeners
      this.listeners.forEach(listener => {
        try {
          listener(command, args);
        } catch (error) {
          console.error('Command listener error:', error);
        }
      });
    } catch (error) {
      console.error(`Error executing command "${commandId}":`, error);
      throw error;
    }
  }

  /**
   * Add command execution listener
   */
  onCommandExecute(listener: (command: Command, args?: any) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Calculate fuzzy matching score
   */
  private calculateFuzzyScore(query: string, text: string): number {
    let score = 0;
    let queryIndex = 0;

    for (let i = 0; i < text.length && queryIndex < query.length; i++) {
      if (text[i] === query[queryIndex]) {
        score += 1;
        queryIndex++;
      }
    }

    return queryIndex === query.length ? score / text.length : 0;
  }

  /**
   * Get command execution statistics
   */
  getExecutionStats(): Record<string, number> {
    const stats: Record<string, number> = {};

    this.history.entries.forEach(entry => {
      stats[entry.commandId] = (stats[entry.commandId] || 0) + 1;
    });

    return stats;
  }

  /**
   * Get most frequently used commands
   */
  getMostUsedCommands(count: number = 10): Command[] {
    const stats = this.getExecutionStats();

    return Object.entries(stats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, count)
      .map(([commandId]) => this.get(commandId))
      .filter((command): command is Command => command !== undefined);
  }

  /**
   * Clear all commands (useful for testing)
   */
  clear(): void {
    this.commands.clear();
    this.history.clear();
  }
}

// Global command registry instance
export const commandRegistry = new CommandRegistryImpl();

// Export types and utilities
export { CommandHistoryImpl };
export type { CommandExecutionContext, CommandHistory };
