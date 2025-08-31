/**
 * @fileoverview Global state management with Zustand for CodeForge IDE
 * @module store/appStore
 * @version 1.0.0
 * @author CodeForge Team
 *
 * @description
 * Centralized state management using Zustand for CodeForge IDE.
 * Manages application state, user preferences, UI state, and feature flags.
 */

import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Types for state management
export interface AppSettings {
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  lineNumbers: boolean;
  minimap: boolean;
  autoSave: boolean;
  autoSaveDelay: number;
  formatOnSave: boolean;
  trimTrailingWhitespace: boolean;
}

export interface EditorState {
  activeFileId: string | null;
  openFiles: Array<{
    id: string;
    path: string;
    name: string;
    content: string;
    isDirty: boolean;
    language: string;
    lastModified: number;
  }>;
  recentFiles: string[];
  splitView: 'none' | 'horizontal' | 'vertical';
  cursorPosition: { line: number; column: number };
  selection: { start: { line: number; column: number }; end: { line: number; column: number } } | null;
}

export interface LayoutState {
  sidebarVisible: boolean;
  sidebarWidth: number;
  panelVisible: boolean;
  panelHeight: number;
  activePanel: 'terminal' | 'problems' | 'output' | 'debug' | null;
  activeSidebarTab: 'explorer' | 'search' | 'source-control' | 'extensions' | null;
  statusBarVisible: boolean;
  activityBarVisible: boolean;
  breadcrumbsVisible: boolean;
}

export interface ProjectState {
  workspacePath: string | null;
  projectName: string | null;
  openFolders: string[];
  excludedFiles: string[];
  includedFiles: string[];
  lastOpenedProjects: Array<{
    path: string;
    name: string;
    lastOpened: number;
  }>;
}

export interface SearchState {
  query: string;
  replaceText: string;
  isRegex: boolean;
  isCaseSensitive: boolean;
  isWholeWord: boolean;
  includeFiles: string;
  excludeFiles: string;
  searchHistory: string[];
  replaceHistory: string[];
  results: Array<{
    file: string;
    line: number;
    column: number;
    text: string;
    match: string;
  }>;
}

export interface TerminalState {
  terminals: Array<{
    id: string;
    name: string;
    cwd: string;
    shell: string;
    isActive: boolean;
    history: string[];
  }>;
  activeTerminalId: string | null;
  defaultShell: string;
  fontSize: number;
  fontFamily: string;
}

export interface NotificationState {
  notifications: Array<{
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
  }>;
  maxNotifications: number;
  defaultDuration: number;
}

export interface UIState {
  isLoading: boolean;
  loadingMessage: string;
  modalStack: Array<{
    id: string;
    component: string;
    props?: any;
  }>;
  contextMenu: {
    visible: boolean;
    x: number;
    y: number;
    items: Array<{
      label: string;
      action: () => void;
      disabled?: boolean;
      separator?: boolean;
    }>;
  } | null;
  dragState: {
    isDragging: boolean;
    dragType: string | null;
    dragData: any;
  };
}

// Combined app state interface
export interface AppState {
  // Core state
  settings: AppSettings;
  editor: EditorState;
  layout: LayoutState;
  project: ProjectState;
  search: SearchState;
  terminal: TerminalState;
  notifications: NotificationState;
  ui: UIState;

  // Actions
  actions: {
    // Settings actions
    updateSettings: (settings: Partial<AppSettings>) => void;
    resetSettings: () => void;

    // Editor actions
    openFile: (file: { id: string; path: string; name: string; content: string; language: string }) => void;
    closeFile: (fileId: string) => void;
    setActiveFile: (fileId: string) => void;
    updateFileContent: (fileId: string, content: string) => void;
    markFileDirty: (fileId: string, isDirty: boolean) => void;
    addRecentFile: (filePath: string) => void;
    setSplitView: (view: 'none' | 'horizontal' | 'vertical') => void;
    setCursorPosition: (position: { line: number; column: number }) => void;
    setSelection: (selection: { start: { line: number; column: number }; end: { line: number; column: number } } | null) => void;

    // Layout actions
    toggleSidebar: () => void;
    setSidebarWidth: (width: number) => void;
    togglePanel: () => void;
    setPanelHeight: (height: number) => void;
    setActivePanel: (panel: 'terminal' | 'problems' | 'output' | 'debug' | null) => void;
    setActiveSidebarTab: (tab: 'explorer' | 'search' | 'source-control' | 'extensions' | null) => void;
    toggleStatusBar: () => void;
    toggleActivityBar: () => void;
    toggleBreadcrumbs: () => void;

    // Project actions
    setWorkspace: (path: string, name: string) => void;
    closeWorkspace: () => void;
    addOpenFolder: (path: string) => void;
    removeOpenFolder: (path: string) => void;
    setExcludedFiles: (patterns: string[]) => void;
    setIncludedFiles: (patterns: string[]) => void;
    addRecentProject: (project: { path: string; name: string }) => void;

    // Search actions
    setSearchQuery: (query: string) => void;
    setReplaceText: (text: string) => void;
    toggleRegex: () => void;
    toggleCaseSensitive: () => void;
    toggleWholeWord: () => void;
    setIncludeFiles: (pattern: string) => void;
    setExcludeFiles: (pattern: string) => void;
    addSearchHistory: (query: string) => void;
    addReplaceHistory: (text: string) => void;
    setSearchResults: (results: any[]) => void;
    clearSearchResults: () => void;

    // Terminal actions
    createTerminal: (name: string, shell: string, cwd: string) => void;
    closeTerminal: (terminalId: string) => void;
    setActiveTerminal: (terminalId: string) => void;
    setDefaultShell: (shell: string) => void;
    setTerminalFont: (fontSize: number, fontFamily: string) => void;

    // Notification actions
    addNotification: (notification: Omit<NotificationState['notifications'][0], 'id' | 'timestamp'>) => void;
    removeNotification: (notificationId: string) => void;
    clearNotifications: () => void;
    setNotificationSettings: (settings: { maxNotifications?: number; defaultDuration?: number }) => void;

    // UI actions
    setLoading: (isLoading: boolean, message?: string) => void;
    pushModal: (modal: { id: string; component: string; props?: any }) => void;
    popModal: () => void;
    clearModals: () => void;
    showContextMenu: (menu: NonNullable<UIState['contextMenu']>) => void;
    hideContextMenu: () => void;
    setDragState: (state: Partial<UIState['dragState']>) => void;
  };
}

// Default state values
const defaultSettings: AppSettings = {
  fontSize: 14,
  tabSize: 2,
  wordWrap: true,
  lineNumbers: true,
  minimap: true,
  autoSave: true,
  autoSaveDelay: 1000,
  formatOnSave: false,
  trimTrailingWhitespace: true,
};

const defaultEditorState: EditorState = {
  activeFileId: null,
  openFiles: [],
  recentFiles: [],
  splitView: 'none',
  cursorPosition: { line: 1, column: 1 },
  selection: null,
};

const defaultLayoutState: LayoutState = {
  sidebarVisible: true,
  sidebarWidth: 300,
  panelVisible: false,
  panelHeight: 200,
  activePanel: null,
  activeSidebarTab: 'explorer',
  statusBarVisible: true,
  activityBarVisible: true,
  breadcrumbsVisible: true,
};

const defaultProjectState: ProjectState = {
  workspacePath: null,
  projectName: null,
  openFolders: [],
  excludedFiles: ['node_modules', '.git', 'dist', 'build'],
  includedFiles: [],
  lastOpenedProjects: [],
};

const defaultSearchState: SearchState = {
  query: '',
  replaceText: '',
  isRegex: false,
  isCaseSensitive: false,
  isWholeWord: false,
  includeFiles: '',
  excludeFiles: '',
  searchHistory: [],
  replaceHistory: [],
  results: [],
};

const defaultTerminalState: TerminalState = {
  terminals: [],
  activeTerminalId: null,
  defaultShell: process.platform === 'win32' ? 'powershell' : 'bash',
  fontSize: 14,
  fontFamily: 'JetBrains Mono, Fira Code, SF Mono, Monaco, Consolas, monospace',
};

const defaultNotificationState: NotificationState = {
  notifications: [],
  maxNotifications: 5,
  defaultDuration: 5000,
};

const defaultUIState: UIState = {
  isLoading: false,
  loadingMessage: '',
  modalStack: [],
  contextMenu: null,
  dragState: {
    isDragging: false,
    dragType: null,
    dragData: null,
  },
};

// Create the store
export const useAppStore = create<AppState>()(
  devtools(
    subscribeWithSelector(
      persist(
        immer((set, get) => ({
          // Initial state
          settings: defaultSettings,
          editor: defaultEditorState,
          layout: defaultLayoutState,
          project: defaultProjectState,
          search: defaultSearchState,
          terminal: defaultTerminalState,
          notifications: defaultNotificationState,
          ui: defaultUIState,

          // Actions
          actions: {
            // Settings actions
            updateSettings: (newSettings) => set((state) => {
              Object.assign(state.settings, newSettings);
            }),

            resetSettings: () => set((state) => {
              state.settings = defaultSettings;
            }),

            // Editor actions
            openFile: (file) => set((state) => {
              const existingIndex = state.editor.openFiles.findIndex(f => f.id === file.id);
              if (existingIndex === -1) {
                state.editor.openFiles.push({
                  ...file,
                  isDirty: false,
                  lastModified: Date.now(),
                });
              }
              state.editor.activeFileId = file.id;
            }),

            closeFile: (fileId) => set((state) => {
              state.editor.openFiles = state.editor.openFiles.filter(f => f.id !== fileId);
              if (state.editor.activeFileId === fileId) {
                state.editor.activeFileId = state.editor.openFiles[0]?.id || null;
              }
            }),

            setActiveFile: (fileId) => set((state) => {
              state.editor.activeFileId = fileId;
            }),

            updateFileContent: (fileId, content) => set((state) => {
              const file = state.editor.openFiles.find(f => f.id === fileId);
              if (file) {
                file.content = content;
                file.lastModified = Date.now();
              }
            }),

            markFileDirty: (fileId, isDirty) => set((state) => {
              const file = state.editor.openFiles.find(f => f.id === fileId);
              if (file) {
                file.isDirty = isDirty;
              }
            }),

            addRecentFile: (filePath) => set((state) => {
              state.editor.recentFiles = [
                filePath,
                ...state.editor.recentFiles.filter(p => p !== filePath)
              ].slice(0, 10);
            }),

            setSplitView: (view) => set((state) => {
              state.editor.splitView = view;
            }),

            setCursorPosition: (position) => set((state) => {
              state.editor.cursorPosition = position;
            }),

            setSelection: (selection) => set((state) => {
              state.editor.selection = selection;
            }),

            // Layout actions
            toggleSidebar: () => set((state) => {
              state.layout.sidebarVisible = !state.layout.sidebarVisible;
            }),

            setSidebarWidth: (width) => set((state) => {
              state.layout.sidebarWidth = Math.max(200, Math.min(800, width));
            }),

            togglePanel: () => set((state) => {
              state.layout.panelVisible = !state.layout.panelVisible;
            }),

            setPanelHeight: (height) => set((state) => {
              state.layout.panelHeight = Math.max(100, Math.min(600, height));
            }),

            setActivePanel: (panel) => set((state) => {
              state.layout.activePanel = panel;
              if (panel) {
                state.layout.panelVisible = true;
              }
            }),

            setActiveSidebarTab: (tab) => set((state) => {
              state.layout.activeSidebarTab = tab;
              if (tab) {
                state.layout.sidebarVisible = true;
              }
            }),

            toggleStatusBar: () => set((state) => {
              state.layout.statusBarVisible = !state.layout.statusBarVisible;
            }),

            toggleActivityBar: () => set((state) => {
              state.layout.activityBarVisible = !state.layout.activityBarVisible;
            }),

            toggleBreadcrumbs: () => set((state) => {
              state.layout.breadcrumbsVisible = !state.layout.breadcrumbsVisible;
            }),

            // Project actions
            setWorkspace: (path, name) => set((state) => {
              state.project.workspacePath = path;
              state.project.projectName = name;
            }),

            closeWorkspace: () => set((state) => {
              state.project.workspacePath = null;
              state.project.projectName = null;
              state.project.openFolders = [];
              state.editor.openFiles = [];
              state.editor.activeFileId = null;
            }),

            addOpenFolder: (path) => set((state) => {
              if (!state.project.openFolders.includes(path)) {
                state.project.openFolders.push(path);
              }
            }),

            removeOpenFolder: (path) => set((state) => {
              state.project.openFolders = state.project.openFolders.filter(p => p !== path);
            }),

            setExcludedFiles: (patterns) => set((state) => {
              state.project.excludedFiles = patterns;
            }),

            setIncludedFiles: (patterns) => set((state) => {
              state.project.includedFiles = patterns;
            }),

            addRecentProject: (project) => set((state) => {
              const existing = state.project.lastOpenedProjects.findIndex(p => p.path === project.path);
              if (existing !== -1) {
                state.project.lastOpenedProjects.splice(existing, 1);
              }
              state.project.lastOpenedProjects.unshift({
                ...project,
                lastOpened: Date.now(),
              });
              state.project.lastOpenedProjects = state.project.lastOpenedProjects.slice(0, 10);
            }),

            // Search actions
            setSearchQuery: (query) => set((state) => {
              state.search.query = query;
            }),

            setReplaceText: (text) => set((state) => {
              state.search.replaceText = text;
            }),

            toggleRegex: () => set((state) => {
              state.search.isRegex = !state.search.isRegex;
            }),

            toggleCaseSensitive: () => set((state) => {
              state.search.isCaseSensitive = !state.search.isCaseSensitive;
            }),

            toggleWholeWord: () => set((state) => {
              state.search.isWholeWord = !state.search.isWholeWord;
            }),

            setIncludeFiles: (pattern) => set((state) => {
              state.search.includeFiles = pattern;
            }),

            setExcludeFiles: (pattern) => set((state) => {
              state.search.excludeFiles = pattern;
            }),

            addSearchHistory: (query) => set((state) => {
              if (query.trim()) {
                state.search.searchHistory = [
                  query,
                  ...state.search.searchHistory.filter(h => h !== query)
                ].slice(0, 20);
              }
            }),

            addReplaceHistory: (text) => set((state) => {
              if (text.trim()) {
                state.search.replaceHistory = [
                  text,
                  ...state.search.replaceHistory.filter(h => h !== text)
                ].slice(0, 20);
              }
            }),

            setSearchResults: (results) => set((state) => {
              state.search.results = results;
            }),

            clearSearchResults: () => set((state) => {
              state.search.results = [];
            }),

            // Terminal actions
            createTerminal: (name, shell, cwd) => set((state) => {
              const id = `terminal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
              const terminal = {
                id,
                name,
                shell,
                cwd,
                isActive: true,
                history: [],
              };

              // Mark other terminals as inactive
              state.terminal.terminals.forEach(t => t.isActive = false);

              state.terminal.terminals.push(terminal);
              state.terminal.activeTerminalId = id;
            }),

            closeTerminal: (terminalId) => set((state) => {
              state.terminal.terminals = state.terminal.terminals.filter(t => t.id !== terminalId);
              if (state.terminal.activeTerminalId === terminalId) {
                const remaining = state.terminal.terminals[0];
                state.terminal.activeTerminalId = remaining?.id || null;
                if (remaining) {
                  remaining.isActive = true;
                }
              }
            }),

            setActiveTerminal: (terminalId) => set((state) => {
              state.terminal.terminals.forEach(t => {
                t.isActive = t.id === terminalId;
              });
              state.terminal.activeTerminalId = terminalId;
            }),

            setDefaultShell: (shell) => set((state) => {
              state.terminal.defaultShell = shell;
            }),

            setTerminalFont: (fontSize, fontFamily) => set((state) => {
              state.terminal.fontSize = fontSize;
              state.terminal.fontFamily = fontFamily;
            }),

            // Notification actions
            addNotification: (notification) => set((state) => {
              const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
              const newNotification = {
                ...notification,
                id,
                timestamp: Date.now(),
              };

              state.notifications.notifications.unshift(newNotification);

              // Keep only max notifications
              if (state.notifications.notifications.length > state.notifications.maxNotifications) {
                state.notifications.notifications = state.notifications.notifications.slice(0, state.notifications.maxNotifications);
              }
            }),

            removeNotification: (notificationId) => set((state) => {
              state.notifications.notifications = state.notifications.notifications.filter(n => n.id !== notificationId);
            }),

            clearNotifications: () => set((state) => {
              state.notifications.notifications = [];
            }),

            setNotificationSettings: (settings) => set((state) => {
              Object.assign(state.notifications, settings);
            }),

            // UI actions
            setLoading: (isLoading, message = '') => set((state) => {
              state.ui.isLoading = isLoading;
              state.ui.loadingMessage = message;
            }),

            pushModal: (modal) => set((state) => {
              state.ui.modalStack.push(modal);
            }),

            popModal: () => set((state) => {
              state.ui.modalStack.pop();
            }),

            clearModals: () => set((state) => {
              state.ui.modalStack = [];
            }),

            showContextMenu: (menu) => set((state) => {
              state.ui.contextMenu = menu;
            }),

            hideContextMenu: () => set((state) => {
              state.ui.contextMenu = null;
            }),

            setDragState: (dragState) => set((state) => {
              Object.assign(state.ui.dragState, dragState);
            }),
          },
        })),
        {
          name: 'codeforge-app-store',
          partialize: (state) => ({
            settings: state.settings,
            layout: {
              sidebarWidth: state.layout.sidebarWidth,
              panelHeight: state.layout.panelHeight,
              sidebarVisible: state.layout.sidebarVisible,
              panelVisible: state.layout.panelVisible,
              activeSidebarTab: state.layout.activeSidebarTab,
              statusBarVisible: state.layout.statusBarVisible,
              activityBarVisible: state.layout.activityBarVisible,
              breadcrumbsVisible: state.layout.breadcrumbsVisible,
            },
            project: {
              lastOpenedProjects: state.project.lastOpenedProjects,
              excludedFiles: state.project.excludedFiles,
              includedFiles: state.project.includedFiles,
            },
            editor: {
              recentFiles: state.editor.recentFiles,
            },
            search: {
              searchHistory: state.search.searchHistory,
              replaceHistory: state.search.replaceHistory,
            },
            terminal: {
              defaultShell: state.terminal.defaultShell,
              fontSize: state.terminal.fontSize,
              fontFamily: state.terminal.fontFamily,
            },
            notifications: {
              maxNotifications: state.notifications.maxNotifications,
              defaultDuration: state.notifications.defaultDuration,
            },
          }),
        }
      )
    ),
    {
      name: 'CodeForge IDE Store',
    }
  )
);

// Selector hooks for optimized component subscriptions
export const useSettings = () => useAppStore((state) => state.settings);
export const useEditor = () => useAppStore((state) => state.editor);
export const useLayout = () => useAppStore((state) => state.layout);
export const useProject = () => useAppStore((state) => state.project);
export const useSearch = () => useAppStore((state) => state.search);
export const useTerminal = () => useAppStore((state) => state.terminal);
export const useNotifications = () => useAppStore((state) => state.notifications);
export const useUI = () => useAppStore((state) => state.ui);
export const useActions = () => useAppStore((state) => state.actions);

// Specific selector hooks
export const useActiveFile = () => useAppStore((state) => {
  const activeFileId = state.editor.activeFileId;
  return activeFileId ? state.editor.openFiles.find(f => f.id === activeFileId) : null;
});

export const useOpenFiles = () => useAppStore((state) => state.editor.openFiles);
export const useIsSidebarVisible = () => useAppStore((state) => state.layout.sidebarVisible);
export const useIsPanelVisible = () => useAppStore((state) => state.layout.panelVisible);
export const useActiveTerminal = () => useAppStore((state) => {
  const activeId = state.terminal.activeTerminalId;
  return activeId ? state.terminal.terminals.find(t => t.id === activeId) : null;
});

export default useAppStore;
