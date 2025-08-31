/**
 * @fileoverview Logging service for CodeForge IDE
 * @module services/LoggingService
 * @version 1.0.0
 * @author CodeForge Team
 *
 * @description
 * Centralized logging service with multiple log levels, structured logging,
 * error tracking, and integration with external logging services.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  source?: string;
  userId?: string;
  sessionId?: string;
  errorId?: string;
  stack?: string;
}

export interface LoggingConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableStorage: boolean;
  maxStorageEntries: number;
  enableRemote: boolean;
  remoteUrl?: string;
  apiKey?: string;
  batchSize: number;
  flushInterval: number;
}

/**
 * Centralized logging service
 */
class LoggingServiceImpl {
  private config: LoggingConfig;
  private logBuffer: LogEntry[] = [];
  private sessionId: string;
  private userId: string = 'anonymous';
  private flushTimer: number | null = null;

  private readonly LOG_LEVELS: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    fatal: 4,
  };

  constructor(config: Partial<LoggingConfig> = {}) {
    this.config = {
      level: 'info',
      enableConsole: true,
      enableStorage: true,
      maxStorageEntries: 1000,
      enableRemote: false,
      batchSize: 10,
      flushInterval: 5000,
      ...config,
    };

    this.sessionId = this.generateSessionId();
    this.initializeLogging();
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Initialize logging service
   */
  private initializeLogging(): void {
    // Load stored logs
    this.loadStoredLogs();

    // Set up periodic flush
    if (this.config.enableRemote && this.config.flushInterval > 0) {
      this.scheduleFlush();
    }

    // Handle page unload
    window.addEventListener('beforeunload', () => {
      this.flush();
    });

    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flush();
      }
    });
  }

  /**
   * Set user ID for logging context
   */
  setUserId(userId: string): void {
    this.userId = userId;
  }

  /**
   * Update logging configuration
   */
  configure(config: Partial<LoggingConfig>): void {
    this.config = { ...this.config, ...config };

    if (this.config.enableRemote && this.config.flushInterval > 0) {
      this.scheduleFlush();
    }
  }

  /**
   * Check if log level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    return this.LOG_LEVELS[level] >= this.LOG_LEVELS[this.config.level];
  }

  /**
   * Create log entry
   */
  private createLogEntry(
    level: LogLevel,
    message: string,
    data?: any,
    source?: string,
    error?: Error
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      source,
      userId: this.userId,
      sessionId: this.sessionId,
    };

    if (error) {
      entry.errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      entry.stack = error.stack;
    }

    return entry;
  }

  /**
   * Log message with specified level
   */
  private log(
    level: LogLevel,
    message: string,
    data?: any,
    source?: string,
    error?: Error
  ): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry = this.createLogEntry(level, message, data, source, error);

    // Console logging
    if (this.config.enableConsole) {
      this.logToConsole(entry);
    }

    // Storage logging
    if (this.config.enableStorage) {
      this.logToStorage(entry);
    }

    // Remote logging
    if (this.config.enableRemote) {
      this.addToBuffer(entry);
    }
  }

  /**
   * Log to browser console
   */
  private logToConsole(entry: LogEntry): void {
    const { level, message, data, source, timestamp } = entry;
    const prefix = `[${timestamp}] [${level.toUpperCase()}]${source ? ` [${source}]` : ''}`;

    switch (level) {
      case 'debug':
        console.debug(prefix, message, data);
        break;
      case 'info':
        console.info(prefix, message, data);
        break;
      case 'warn':
        console.warn(prefix, message, data);
        break;
      case 'error':
      case 'fatal':
        console.error(prefix, message, data);
        break;
    }
  }

  /**
   * Log to local storage
   */
  private logToStorage(entry: LogEntry): void {
    try {
      const stored = this.getStoredLogs();
      stored.push(entry);

      // Keep only recent entries
      if (stored.length > this.config.maxStorageEntries) {
        stored.splice(0, stored.length - this.config.maxStorageEntries);
      }

      localStorage.setItem('codeforge_logs', JSON.stringify(stored));
    } catch (error) {
      console.warn('Failed to store log entry:', error);
    }
  }

  /**
   * Add entry to remote logging buffer
   */
  private addToBuffer(entry: LogEntry): void {
    this.logBuffer.push(entry);

    if (this.logBuffer.length >= this.config.batchSize) {
      this.flush();
    }
  }

  /**
   * Get stored logs from localStorage
   */
  private getStoredLogs(): LogEntry[] {
    try {
      const stored = localStorage.getItem('codeforge_logs');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to load stored logs:', error);
      return [];
    }
  }

  /**
   * Load stored logs into memory
   */
  private loadStoredLogs(): void {
    // This could be used to restore logs on app restart
    // For now, we just ensure localStorage is accessible
    try {
      this.getStoredLogs();
    } catch (error) {
      console.warn('Failed to access stored logs:', error);
    }
  }

  /**
   * Schedule periodic flush
   */
  private scheduleFlush(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    this.flushTimer = window.setInterval(() => {
      if (this.logBuffer.length > 0) {
        this.flush();
      }
    }, this.config.flushInterval);
  }

  /**
   * Flush buffered logs to remote service
   */
  async flush(): Promise<void> {
    if (!this.config.enableRemote || this.logBuffer.length === 0) {
      return;
    }

    const logsToSend = [...this.logBuffer];
    this.logBuffer = [];

    try {
      await this.sendLogsToRemote(logsToSend);
    } catch (error) {
      console.warn('Failed to send logs to remote service:', error);
      // Re-add logs to buffer for retry
      this.logBuffer.unshift(...logsToSend);
    }
  }

  /**
   * Send logs to remote logging service
   */
  private async sendLogsToRemote(logs: LogEntry[]): Promise<void> {
    if (!this.config.remoteUrl) {
      throw new Error('Remote URL not configured');
    }

    const response = await fetch(this.config.remoteUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey && { Authorization: `Bearer ${this.config.apiKey}` }),
      },
      body: JSON.stringify({
        logs,
        metadata: {
          userAgent: navigator.userAgent,
          url: window.location.href,
          timestamp: new Date().toISOString(),
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Remote logging failed: ${response.status} ${response.statusText}`);
    }
  }

  /**
   * Public logging methods
   */
  debug(message: string, data?: any, source?: string): void {
    this.log('debug', message, data, source);
  }

  info(message: string, data?: any, source?: string): void {
    this.log('info', message, data, source);
  }

  warn(message: string, data?: any, source?: string): void {
    this.log('warn', message, data, source);
  }

  error(message: string, error?: Error, data?: any, source?: string): void {
    this.log('error', message, data, source, error);
  }

  fatal(message: string, error?: Error, data?: any, source?: string): void {
    this.log('fatal', message, data, source, error);
  }

  /**
   * Log performance metrics
   */
  performance(name: string, duration: number, data?: any): void {
    this.info(`Performance: ${name}`, {
      duration,
      ...data,
    }, 'performance');
  }

  /**
   * Log user actions
   */
  userAction(action: string, data?: any): void {
    this.info(`User Action: ${action}`, data, 'user-action');
  }

  /**
   * Log system events
   */
  system(event: string, data?: any): void {
    this.info(`System: ${event}`, data, 'system');
  }

  /**
   * Get recent logs
   */
  getRecentLogs(count: number = 100): LogEntry[] {
    const stored = this.getStoredLogs();
    return stored.slice(-count);
  }

  /**
   * Clear all stored logs
   */
  clearLogs(): void {
    try {
      localStorage.removeItem('codeforge_logs');
      this.logBuffer = [];
    } catch (error) {
      console.warn('Failed to clear logs:', error);
    }
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    const logs = this.getStoredLogs();
    return JSON.stringify(logs, null, 2);
  }

  /**
   * Get logging statistics
   */
  getStats(): Record<LogLevel, number> & { total: number } {
    const logs = this.getStoredLogs();
    const stats = {
      debug: 0,
      info: 0,
      warn: 0,
      error: 0,
      fatal: 0,
      total: logs.length,
    };

    logs.forEach(log => {
      if (stats[log.level] !== undefined) {
        stats[log.level]++;
      }
    });

    return stats;
  }

  /**
   * Cleanup and destroy service
   */
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }

    this.flush();
  }
}

// Global logging service instance
export const loggingService = new LoggingServiceImpl();

// Convenience exports
export const logger = loggingService;
export default loggingService;
