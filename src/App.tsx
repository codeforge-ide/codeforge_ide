import React from 'react';
import { ThemeProvider } from './themes';
import { CommandProvider } from './components/commands';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { NotificationSystem } from './components/common/NotificationSystem';
import { IDELayout } from './components/layout/IDELayout.tsx';
import { loggingService } from './services/LoggingService';
import './App.css';
import './components/common/ErrorBoundary.css';

// Initialize logging service
loggingService.info('CodeForge IDE starting up', { version: '1.0.0' }, 'app');

function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        loggingService.error(
          'Application error caught by boundary',
          error,
          {
            componentStack: errorInfo.componentStack,
          },
          'error-boundary'
        );
      }}
    >
      <ThemeProvider>
        <CommandProvider>
          <IDELayout />
          <NotificationSystem />
        </CommandProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
