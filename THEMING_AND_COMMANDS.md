# CodeForge IDE - Core UI System Implementation

## 🎯 Overview

This document outlines the comprehensive UI system implemented for CodeForge IDE, featuring a pitch-dark theme system and command palette with keyboard shortcuts (Ctrl+Shift+P). The system follows radical modularity principles with strict file size limits and clean architecture.

## 🎨 Theme System

### Architecture

The theme system is built around CSS custom properties (CSS variables) and React context, providing:

- **Multiple theme modes**: Pitch Dark, Dark, Light, High Contrast
- **Dynamic theme switching**: Real-time theme changes without page reload
- **System preference detection**: Automatic dark/light mode detection
- **Persistent preferences**: Theme selection saved to localStorage
- **CSS custom properties**: All colors, typography, and spacing defined as CSS variables

### Theme Structure

```typescript
interface Theme {
  id: string;           // Unique identifier
  name: string;         // Display name
  mode: ThemeMode;      // Theme category
  colors: ThemeColors;  // Complete color palette
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  shadows: ThemeShadows;
  borderRadius: ThemeBorderRadius;
  transitions: ThemeTransitions;
}
```

### Available Themes

1. **Pitch Dark** (Default)
   - Pure black backgrounds (#000000)
   - Darkest possible theme for OLED displays
   - Optimal for low-light environments

2. **Dark** 
   - Standard dark theme (#1e1e1e backgrounds)
   - VS Code-inspired color palette
   - Balanced contrast

3. **Light**
   - Clean white backgrounds
   - High readability for bright environments
   - Professional appearance

4. **High Contrast**
   - Maximum accessibility
   - WCAG AAA compliance
   - Enhanced borders and focus indicators

### Color Palette Structure

Each theme defines colors for:

- **Backgrounds**: Primary, secondary, tertiary, elevated, overlay
- **Foregrounds**: Primary, secondary, tertiary, disabled, inverse
- **Borders**: Primary, secondary, focus, error, warning, success
- **Interactive**: Primary, hover states, accent colors
- **Status**: Error, warning, success, info (with background variants)
- **Syntax**: Complete syntax highlighting palette
- **Git**: Version control status colors
- **Editor**: Selection, highlights, line numbers
- **Terminal**: Full ANSI color support

### Usage Examples

```tsx
// Using theme context
const { currentTheme, setTheme, toggleTheme } = useTheme();

// Accessing specific color groups
const colors = useThemeColors();
const typography = useThemeTypography();

// Theme checks
const isDark = useIsDarkTheme();
const isLight = useIsLightTheme();
```

```css
/* Using CSS custom properties */
.component {
  background-color: var(--color-bg-primary);
  color: var(--color-fg-primary);
  border: 1px solid var(--color-border-secondary);
  font-family: var(--font-family-sans);
  padding: var(--spacing-4);
  border-radius: var(--border-radius-md);
}
```

## ⌨️ Command System

### Architecture

The command system provides a VS Code-like command palette with:

- **Keyboard shortcuts**: Global hotkey management
- **Command registry**: Centralized command registration
- **Search functionality**: Fuzzy search with ranking
- **Categories**: Organized command grouping
- **History tracking**: Recent command execution
- **Extension support**: Plugin command registration

### Core Components

#### Command Registry
- Manages all registered commands
- Provides search and filtering
- Tracks execution history
- Handles command validation

#### Keyboard Manager
- Global keyboard event handling
- Shortcut conflict detection
- Platform-specific key mapping
- Context-aware execution

#### Command Palette
- Modern search interface
- Keyboard navigation
- Category-based organization
- Real-time filtering

### Built-in Commands

#### Theme Commands
- `Theme: Select Color Theme` (Ctrl+Shift+T)
- `Theme: Toggle Dark/Light`
- Individual theme selection commands
- Theme preview functionality

#### File Commands
- `File: New File` (Ctrl+N)
- `File: Open File` (Ctrl+O)
- `File: Save` (Ctrl+S)
- `File: Save As` (Ctrl+Shift+S)
- `File: Close` (Ctrl+W)

#### Edit Commands
- `Edit: Undo` (Ctrl+Z)
- `Edit: Redo` (Ctrl+Y)
- `Edit: Cut` (Ctrl+X)
- `Edit: Copy` (Ctrl+C)
- `Edit: Paste` (Ctrl+V)

#### View Commands
- `View: Show Command Palette` (Ctrl+Shift+P)
- `View: Show Explorer` (Ctrl+Shift+E)
- `View: Show Search` (Ctrl+Shift+F)
- `View: Show Source Control` (Ctrl+Shift+G)
- `View: Show Terminal` (Ctrl+`)

### Command Structure

```typescript
interface Command {
  id: string;                     // Unique identifier
  title: string;                  // Display name
  description?: string;           // Optional description
  category: CommandCategory;      // Grouping category
  keywords?: string[];            // Search keywords
  icon?: string;                  // Optional icon
  keybinding?: KeyboardShortcut;  // Keyboard shortcut
  action: CommandAction;          // Execution function
  priority?: number;              // Search ranking
}
```

### Usage Examples

```tsx
// Using command hooks
const { executeCommand, openPalette } = useCommands();
const { getAllCommands, searchCommands } = useCommandExecution();
const { registerShortcut } = useKeyboardShortcuts();

// Executing commands
await executeCommand('theme.pitchDark');
await executeCommand('file.save', { path: 'document.txt' });

// Opening command palette
openPalette();
```

## 🏗️ Architecture Principles

### Radical Modularity

Following the project's core principle of radical modularity:

- **File size limits**: Maximum 200 lines per file
- **Single responsibility**: Each module has one clear purpose
- **Testability**: Isolated, easily testable components
- **Replaceability**: Components can be swapped without affecting others

### File Organization

```
src/
├── themes/
│   ├── types.ts              # Theme type definitions
│   ├── constants.ts          # Predefined themes
│   ├── ThemeProvider.tsx     # Theme context provider
│   └── index.ts              # Module exports
├── components/
│   ├── commands/
│   │   ├── types.ts          # Command system types
│   │   ├── CommandRegistry.ts # Command management
│   │   ├── KeyboardManager.ts # Shortcut handling
│   │   ├── CommandPalette.tsx # UI component
│   │   ├── CommandProvider.tsx # Context provider
│   │   ├── builtInCommands.ts # Default commands
│   │   └── index.ts          # Module exports
│   └── layout/
│       ├── IDELayout.tsx     # Main layout
│       ├── Header.tsx        # Top header
│       └── ...               # Other layout components
└── App.tsx                   # Root application
```

### Component Hierarchy

```tsx
<App>
  <ThemeProvider>
    <CommandProvider>
      <IDELayout>
        <Header />
        <div className="ide-body">
          <Sidebar />
          <MainArea />
        </div>
        <StatusBar />
      </IDELayout>
      <CommandPalette />
    </CommandProvider>
  </ThemeProvider>
</App>
```

## 🎹 Keyboard Shortcuts

### Global Shortcuts

| Shortcut | Command | Description |
|----------|---------|-------------|
| `Ctrl+Shift+P` | Show Command Palette | Open command palette |
| `Ctrl+Shift+T` | Select Theme | Open theme selector |
| `Ctrl+N` | New File | Create new file |
| `Ctrl+O` | Open File | Open existing file |
| `Ctrl+S` | Save | Save current file |
| `Ctrl+Shift+S` | Save As | Save with new name |
| `Ctrl+W` | Close File | Close current file |
| `Ctrl+Z` | Undo | Undo last action |
| `Ctrl+Y` | Redo | Redo last action |
| `Ctrl+X` | Cut | Cut selection |
| `Ctrl+C` | Copy | Copy selection |
| `Ctrl+V` | Paste | Paste from clipboard |

### Command Palette Navigation

| Key | Action |
|-----|--------|
| `↑/↓` | Navigate commands |
| `Enter` | Execute selected command |
| `Escape` | Close palette |
| `Tab/Shift+Tab` | Navigate commands |

## 🔧 Technical Implementation

### Theme Application

Themes are applied through CSS custom properties injected into the document root:

```typescript
const applyThemeToDOM = (theme: Theme) => {
  const root = document.documentElement;
  
  // Apply color variables
  Object.entries(theme.colors.background).forEach(([key, value]) => {
    root.style.setProperty(`--color-bg-${key}`, value);
  });
  
  // Apply typography, spacing, etc.
  // ...
  
  // Set theme class
  root.className = `theme-${theme.mode}`;
};
```

### Command Execution

Commands are executed through a centralized registry with error handling and history tracking:

```typescript
async executeCommand(commandId: string, args?: any): Promise<void> {
  const command = this.get(commandId);
  if (!command) throw new Error(`Command not found: ${commandId}`);
  
  // Check execution conditions
  if (command.action.canExecute && !command.action.canExecute()) {
    throw new Error(`Command cannot be executed: ${commandId}`);
  }
  
  // Execute and track
  await command.action.execute(args);
  this.history.add({ commandId, timestamp: Date.now(), args });
}
```

### Event-Driven Architecture

The system uses custom events for loose coupling between components:

```typescript
// Theme switching
window.dispatchEvent(new CustomEvent('codeforge:setTheme', {
  detail: { themeId: 'pitch-dark' }
}));

// Command palette
window.dispatchEvent(new CustomEvent('codeforge:showCommandPalette'));
```

## 🎨 CSS Custom Properties

### Color Variables

```css
:root {
  /* Background colors */
  --color-bg-primary: #000000;
  --color-bg-secondary: #0a0a0a;
  --color-bg-tertiary: #111111;
  
  /* Foreground colors */
  --color-fg-primary: #e8e8e8;
  --color-fg-secondary: #cccccc;
  --color-fg-tertiary: #888888;
  
  /* Interactive colors */
  --color-interactive-accent: #007acc;
  --color-interactive-primary: #0e639c;
  
  /* Status colors */
  --color-status-error: #f14c4c;
  --color-status-warning: #ffcc02;
  --color-status-success: #89d185;
}
```

### Typography Variables

```css
:root {
  --font-family-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto;
  --font-family-mono: "JetBrains Mono", "Fira Code", "SF Mono", Monaco;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.8125rem;
  --font-size-base: 0.875rem;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
}
```

### Spacing Variables

```css
:root {
  --spacing-1: 0.25rem;  /* 4px */
  --spacing-2: 0.5rem;   /* 8px */
  --spacing-3: 0.75rem;  /* 12px */
  --spacing-4: 1rem;     /* 16px */
  --spacing-6: 1.5rem;   /* 24px */
  --spacing-8: 2rem;     /* 32px */
}
```

## 🚀 Performance Optimizations

### Theme Switching
- CSS custom properties enable instant theme changes
- No component re-rendering required
- Minimal DOM manipulation

### Command Search
- Debounced search input (100ms)
- Fuzzy matching with scoring algorithm
- Limited result sets (50 commands max)
- Virtualized scrolling for large lists

### Memory Management
- WeakMap usage for temporary references
- Event listener cleanup on unmount
- Command history size limits (100 entries)

## 🎯 Accessibility Features

### High Contrast Support
- Dedicated high contrast theme
- Enhanced focus indicators
- Increased border widths
- WCAG AAA compliance

### Keyboard Navigation
- Full keyboard accessibility
- Tab order management
- Focus trap in modals
- Screen reader support

### Reduced Motion
- Respects `prefers-reduced-motion`
- Disables animations when requested
- Instant transitions fallback

## 🔮 Future Enhancements

### Theme System
- [ ] Custom theme creation UI
- [ ] Theme import/export
- [ ] Syntax highlighting customization
- [ ] Color blindness simulation
- [ ] Theme marketplace integration

### Command System
- [ ] Command aliases
- [ ] Macro recording
- [ ] Command chaining
- [ ] Voice commands
- [ ] Machine learning ranking

### Performance
- [ ] Command palette virtualization
- [ ] Theme compilation optimization
- [ ] CSS-in-JS migration option
- [ ] Web Workers for search

## 📝 Development Guidelines

### Adding New Themes

1. Define theme in `src/themes/constants.ts`
2. Add to THEMES array
3. Test all color combinations
4. Verify accessibility compliance
5. Update documentation

### Adding New Commands

1. Define command in `src/components/commands/builtInCommands.ts`
2. Add keyboard shortcut if applicable
3. Include in appropriate category
4. Add search keywords
5. Implement action function
6. Write unit tests

### File Size Compliance

- Keep files under 200 lines
- Split large files into modules
- Use composition over inheritance
- Maintain single responsibility
- Regular file size audits

## 🧪 Testing Strategy

### Theme Testing
- Visual regression tests
- Color contrast validation
- Cross-browser compatibility
- System preference detection
- Theme persistence

### Command Testing
- Command execution tests
- Keyboard shortcut validation
- Search functionality tests
- History tracking tests
- Error handling tests

### Integration Testing
- Theme + command integration
- Keyboard navigation flows
- Accessibility compliance
- Performance benchmarks
- Memory leak detection

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Status**: Core Implementation Complete

This UI system provides a solid foundation for the CodeForge IDE with professional theming, comprehensive command system, and accessibility-first design. The modular architecture ensures maintainability and extensibility as the project grows.