/**
 * @fileoverview Notification system component for CodeForge IDE
 * @module components/common/NotificationSystem
 * @version 1.0.0
 * @author CodeForge Team
 *
 * @description
 * Toast notification system with multiple types, auto-dismiss, actions,
 * and smooth animations. Integrates with global state management.
 */

import React, { useEffect, useCallback } from 'react';
import { useNotifications, useActions } from '../../store/appStore';
import { useTheme } from '../../themes/ThemeProvider';
import './NotificationSystem.css';

interface NotificationItemProps {
  notification: {
    id: string;
    type: 'info' | 'warning' | 'error' | 'success';
    title: string;
    message: string;
    timestamp: number;
    autoClose: boolean;
    duration: number;
    actions?: Array<{
      label: string;
      action: () => void;
    }>;
  };
  onClose: (id: string) => void;
}

/**
 * Individual notification item component
 */
const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClose }) => {
  const { currentTheme } = useTheme();

  // Auto-close notification after duration
  useEffect(() => {
    if (notification.autoClose && notification.duration > 0) {
      const timer = setTimeout(() => {
        onClose(notification.id);
      }, notification.duration);

      return () => clearTimeout(timer);
    }
  }, [notification.id, notification.autoClose, notification.duration, onClose]);

  // Handle action execution
  const handleAction = useCallback((action: () => void) => {
    action();
    onClose(notification.id);
  }, [notification.id, onClose]);

  // Get notification icon
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'error':
        return '✕';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  // Get notification color
  const getNotificationColor = () => {
    switch (notification.type) {
      case 'success':
        return currentTheme.colors.status.success;
      case 'warning':
        return currentTheme.colors.status.warning;
      case 'error':
        return currentTheme.colors.status.error;
      case 'info':
      default:
        return currentTheme.colors.status.info;
    }
  };

  // Format timestamp
  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;

    if (diff < 60000) { // Less than 1 minute
      return 'now';
    } else if (diff < 3600000) { // Less than 1 hour
      return `${Math.floor(diff / 60000)}m ago`;
    } else {
      return new Date(timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  return (
    <div
      className={`notification-item notification-${notification.type}`}
      role="alert"
      aria-live="polite"
    >
      <div
        className="notification-indicator"
        style={{ backgroundColor: getNotificationColor() }}
      />

      <div className="notification-icon">
        {getIcon()}
      </div>

      <div className="notification-content">
        <div className="notification-header">
          <h4 className="notification-title">{notification.title}</h4>
          <span className="notification-time">
            {formatTime(notification.timestamp)}
          </span>
        </div>

        <p className="notification-message">{notification.message}</p>

        {notification.actions && notification.actions.length > 0 && (
          <div className="notification-actions">
            {notification.actions.map((action, index) => (
              <button
                key={index}
                className="notification-action"
                onClick={() => handleAction(action.action)}
                type="button"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        className="notification-close"
        onClick={() => onClose(notification.id)}
        aria-label="Close notification"
        type="button"
      >
        ×
      </button>
    </div>
  );
};

/**
 * Main notification system component
 */
export const NotificationSystem: React.FC = () => {
  const { notifications } = useNotifications();
  const { removeNotification, clearNotifications } = useActions();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Escape to close all notifications
      if (event.key === 'Escape' && notifications.length > 0) {
        clearNotifications();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [notifications.length, clearNotifications]);

  // Don't render if no notifications
  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="notification-system" aria-label="Notifications">
      <div className="notification-container">
        {notifications.length > 1 && (
          <div className="notification-header-controls">
            <span className="notification-count">
              {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
            </span>
            <button
              className="notification-clear-all"
              onClick={clearNotifications}
              type="button"
            >
              Clear All
            </button>
          </div>
        )}

        <div className="notification-list">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClose={removeNotification}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Hook for creating notifications
 */
export const useNotificationActions = () => {
  const { addNotification } = useActions();

  const showSuccess = useCallback((title: string, message: string, options?: {
    duration?: number;
    autoClose?: boolean;
    actions?: Array<{ label: string; action: () => void }>;
  }) => {
    addNotification({
      type: 'success',
      title,
      message,
      autoClose: options?.autoClose ?? true,
      duration: options?.duration ?? 5000,
      actions: options?.actions,
    });
  }, [addNotification]);

  const showError = useCallback((title: string, message: string, options?: {
    duration?: number;
    autoClose?: boolean;
    actions?: Array<{ label: string; action: () => void }>;
  }) => {
    addNotification({
      type: 'error',
      title,
      message,
      autoClose: options?.autoClose ?? false, // Errors don't auto-close by default
      duration: options?.duration ?? 0,
      actions: options?.actions,
    });
  }, [addNotification]);

  const showWarning = useCallback((title: string, message: string, options?: {
    duration?: number;
    autoClose?: boolean;
    actions?: Array<{ label: string; action: () => void }>;
  }) => {
    addNotification({
      type: 'warning',
      title,
      message,
      autoClose: options?.autoClose ?? true,
      duration: options?.duration ?? 8000,
      actions: options?.actions,
    });
  }, [addNotification]);

  const showInfo = useCallback((title: string, message: string, options?: {
    duration?: number;
    autoClose?: boolean;
    actions?: Array<{ label: string; action: () => void }>;
  }) => {
    addNotification({
      type: 'info',
      title,
      message,
      autoClose: options?.autoClose ?? true,
      duration: options?.duration ?? 5000,
      actions: options?.actions,
    });
  }, [addNotification]);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};

export default NotificationSystem;
