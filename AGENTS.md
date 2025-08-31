# CodeForge Development Guidelines & Architecture

## 🎯 Core Philosophy: Radical Modularity

> "Every piece of code should do one thing exceptionally well, be easily testable, and be replaceable without affecting the rest of the system."

---

## 📏 File Size & Modularity Rules

### 🚨 STRICT LIMITS
- **Maximum file size**: 200 lines (including comments and whitespace)
- **Optimal file size**: 50-150 lines
- **Function/method length**: Maximum 30 lines
- **Function parameters**: Maximum 5 parameters (use objects for more)

### 📂 When to Split Files
```
IF file > 150 lines:
  1. Extract interfaces/types → separate .types.ts file
  2. Extract constants → separate .constants.ts file
  3. Extract utilities → separate .utils.ts file
  4. Extract sub-components → separate component files
  5. Extract hooks → separate .hooks.ts file
```

### 🗂️ Module Organization Pattern
```
feature/
├── index.ts                    # Public API exports
├── types.ts                    # Type definitions
├── constants.ts                # Feature constants
├── hooks/                      # Custom hooks
│   ├── useFeature.ts
│   └── useFeatureState.ts
├── components/                 # UI components
│   ├── FeatureComponent.tsx
│   ├── FeatureItem.tsx
│   └── index.ts
├── services/                   # Business logic
│   ├── FeatureService.ts
│   └── FeatureAPI.ts
├── utils/                      # Pure utilities
│   ├── featureHelpers.ts
│   └── featureValidators.ts
└── __tests__/                  # Tests
    ├── FeatureComponent.test.tsx
    └── FeatureService.test.ts
```

---

## 🏗️ Architecture Principles

### 1. Single Responsibility Principle (SRP)
```typescript
// ❌ BAD - File doing multiple things
class FileExplorerManager {
  renderTree() { /* UI logic */ }
  saveFile() { /* File I/O */ }
  validatePath() { /* Validation */ }
  sortFiles() { /* Sorting logic */ }
}

// ✅ GOOD - Split into focused modules
// FileTreeRenderer.tsx - UI rendering only
// FileSystemService.ts - File operations only
// PathValidator.ts - Validation only
// FileSorter.ts - Sorting logic only
```

### 2. Dependency Inversion
```typescript
// ❌ BAD - Tight coupling
class FileExplorer {
  private fileSystem = new FileSystemService();
}

// ✅ GOOD - Dependency injection
class FileExplorer {
  constructor(private fileSystem: IFileSystemService) {}
}
```

### 3. Interface Segregation
```typescript
// ❌ BAD - Fat interface
interface IFileService {
  read(): string;
  write(): void;
  delete(): void;
  compress(): void;
  encrypt(): void;
  backup(): void;
}

// ✅ GOOD - Segregated interfaces
interface IFileReader { read(): string; }
interface IFileWriter { write(): void; }
interface IFileDeleter { delete(): void; }
interface IFileCompressor { compress(): void; }
```

---

## 📦 Module Categories & Guidelines

### 🎨 UI Components (React)
```typescript
// Component file structure (max 150 lines)
// Button.tsx
import React from 'react';
import { ButtonProps } from './Button.types';
import { useButton } from './Button.hooks';
import styles from './Button.module.css';

export const Button: React.FC<ButtonProps> = (props) => {
  const { handleClick, isLoading } = useButton(props);
  
  return (
    <button 
      className={styles.button}
      onClick={handleClick}
      disabled={isLoading}
    >
      {props.children}
    </button>
  );
};

// Button.types.ts
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
}

// Button.hooks.ts
export const useButton = (props: ButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleClick = useCallback(() => {
    // Logic here
  }, [props.onClick]);
  
  return { handleClick, isLoading };
};
```

### 🔧 Services (Business Logic)
```typescript
// FileSystemService.ts (max 200 lines)
export class FileSystemService implements IFileSystemService {
  constructor(
    private fileReader: IFileReader,
    private fileWriter: IFileWriter,
    private pathValidator: IPathValidator
  ) {}
  
  async readFile(path: string): Promise<string> {
    this.pathValidator.validate(path);
    return this.fileReader.read(path);
  }
  
  // Max 5-7 methods per service
}

// If service grows > 200 lines, split:
// - FileSystemReadService.ts
// - FileSystemWriteService.ts
// - FileSystemWatchService.ts
```

### 🪝 Custom Hooks
```typescript
// useFileExplorer.ts (max 100 lines)
export const useFileExplorer = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  
  // Max 3-5 pieces of state per hook
  // If more needed, split into multiple hooks
  
  return {
    files,
    selectedFile,
    actions: {
      selectFile: setSelectedFile,
      refreshFiles: () => {/* logic */}
    }
  };
};

// If hook > 100 lines, split:
// - useFileExplorerState.ts
// - useFileExplorerActions.ts
// - useFileExplorerEffects.ts
```

### 🛠️ Utilities
```typescript
// pathUtils.ts (max 150 lines)
export const pathUtils = {
  normalize: (path: string): string => {/* logic */},
  join: (...segments: string[]): string => {/* logic */},
  dirname: (path: string): string => {/* logic */},
  basename: (path: string): string => {/* logic */},
  // Max 5-8 utility functions per file
};

// If more utilities needed, create:
// - filePathUtils.ts
// - urlPathUtils.ts
// - relativePath Utils.ts
```

---

## 🎭 Component Composition Strategy

### 📝 Component Hierarchy Rules
```typescript
// ❌ BAD - Monolithic component (300+ lines)
const FileExplorer = () => {
  // All logic, rendering, state in one file
};

// ✅ GOOD - Composed components
const FileExplorer = () => {
  return (
    <FileExplorerContainer>
      <FileTreeHeader />
      <FileTreeContent />
      <FileTreeFooter />
    </FileExplorerContainer>
  );
};

// Each sub-component is 50-100 lines max
```

### 🧩 Composition Patterns
```typescript
// Container/Presenter Pattern
// FileExplorerContainer.tsx - Logic & State
// FileExplorerView.tsx - Pure UI

// Compound Component Pattern
const FileExplorer = {
  Root: FileExplorerRoot,
  Header: FileExplorerHeader,
  Content: FileExplorerContent,
  Item: FileExplorerItem,
};

// Usage:
<FileExplorer.Root>
  <FileExplorer.Header />
  <FileExplorer.Content>
    <FileExplorer.Item />
  </FileExplorer.Content>
</FileExplorer.Root>
```

---

## 🦀 Rust Backend Modularity

### 📁 Rust Module Structure
```rust
// src/lib.rs (entry point only - max 50 lines)
pub mod commands;
pub mod services;
pub mod utils;
pub mod types;

// src/commands/mod.rs (max 100 lines)
pub mod file_commands;
pub mod editor_commands;
pub mod git_commands;

// src/commands/file_commands.rs (max 150 lines)
use crate::services::FileService;

#[tauri::command]
pub async fn read_file(path: String) -> Result<String, String> {
    FileService::new().read_file(&path).await
}

// Max 5-7 commands per file
```

### 🔧 Service Layer Pattern
```rust
// src/services/file_service.rs (max 200 lines)
pub struct FileService {
    file_reader: Box<dyn FileReader>,
    file_writer: Box<dyn FileWriter>,
}

impl FileService {
    pub fn new() -> Self {
        Self {
            file_reader: Box::new(StdFileReader::new()),
            file_writer: Box::new(StdFileWriter::new()),
        }
    }
    
    // Max 8-10 methods per service
}

// If service grows, split into:
// - FileReadService
// - FileWriteService  
// - FileWatchService
```

---

## 🧪 Testing Strategy

### 📊 Testing File Limits
- **Unit test files**: Max 300 lines (more tests allowed)
- **Integration test files**: Max 200 lines
- **E2E test files**: Max 150 lines

### 🎯 Test Organization
```typescript
// Button.test.tsx
describe('Button Component', () => {
  describe('Rendering', () => {
    // 3-5 tests max per describe block
  });
  
  describe('Interactions', () => {
    // 3-5 tests max per describe block
  });
  
  describe('Props', () => {
    // 3-5 tests max per describe block
  });
});

// If more tests needed, split:
// - Button.render.test.tsx
// - Button.interactions.test.tsx
// - Button.props.test.tsx
```

---

## 📐 Code Quality Metrics

### 🎯 Enforced Metrics
```json
// .eslintrc.js
{
  "rules": {
    "max-lines": ["error", 200],
    "max-lines-per-function": ["error", 30],
    "max-params": ["error", 5],
    "complexity": ["error", 10],
    "max-depth": ["error", 4],
    "max-nested-callbacks": ["error", 3]
  }
}
```

### 📊 File Size Monitoring
```typescript
// scripts/check-file-sizes.ts
const MAX_LINES = {
  '.tsx': 150,
  '.ts': 200,
  '.rs': 200,
  '.test.tsx': 300,
  '.test.ts': 300
};

// Run in CI to enforce limits
```

---

## 🎨 State Management Architecture

### 🗂️ Redux Toolkit Slices (Max 150 lines each)
```typescript
// fileExplorerSlice.ts
const fileExplorerSlice = createSlice({
  name: 'fileExplorer',
  initialState,
  reducers: {
    // Max 5-7 reducers per slice
  }
});

// If slice grows, split:
// - fileExplorerStateSlice.ts
// - fileExplorerActionsSlice.ts
// - fileExplorerSelectors.ts
```

### 🪝 Custom Hook State Management
```typescript
// useGlobalState.ts - Max 100 lines
export const useGlobalState = () => {
  // Max 3-4 global state pieces
};

// Split larger state:
// - useAppState.ts
// - useUserState.ts
// - useProjectState.ts
```

---

## 🛠️ Development Tools & Automation

### 📏 File Size Checker
```bash
#!/bin/bash
# scripts/check-modularity.sh

find src -name "*.tsx" -o -name "*.ts" | while read file; do
  lines=$(wc -l < "$file")
  if [ $lines -gt 200 ]; then
    echo "❌ $file: $lines lines (exceeds 200 limit)"
  fi
done
```

### 🔍 Complexity Analyzer
```typescript
// scripts/analyze-complexity.ts
// Analyze cyclomatic complexity
// Check function length
// Verify parameter counts
// Report violations
```

### 🚨 Pre-commit Hooks
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run check-modularity && npm run lint && npm run test"
    }
  }
}
```

---

## 📚 Documentation Standards

### 📝 File Headers
```typescript
/**
 * @fileoverview Brief description of what this module does
 * @module ModuleName
 * @version 1.0.0
 * @author CodeForge Team
 * 
 * @description
 * Detailed description of the module's purpose, its main responsibilities,
 * and how it fits into the larger application architecture.
 * 
 * @dependencies
 * - List key dependencies
 * - External libraries used
 * 
 * @example
 * ```typescript
 * // Basic usage example
 * ```
 */
```

### 🏷️ Function Documentation
```typescript
/**
 * Brief function description
 * 
 * @param param1 - Description of parameter
 * @param param2 - Description of parameter
 * @returns Description of return value
 * 
 * @throws {Error} When specific condition occurs
 * 
 * @example
 * ```typescript
 * const result = functionName(param1, param2);
 * ```
 */
```

---

## 🚀 Performance Guidelines

### ⚡ Component Performance
```typescript
// Memoization for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  // Component logic
});

// Split heavy components into smaller chunks
const HeavyComponent = () => (
  <>
    <ComponentPart1 />
    <ComponentPart2 />
    <ComponentPart3 />
  </>
);
```

### 🔄 Code Splitting
```typescript
// Route-based splitting
const FileExplorer = lazy(() => import('./FileExplorer'));
const CodeEditor = lazy(() => import('./CodeEditor'));

// Feature-based splitting
const GitPanel = lazy(() => import('./features/git/GitPanel'));
```

---

## 🎯 Module Communication Patterns

### 📡 Event-Driven Architecture
```typescript
// EventBus.ts (max 100 lines)
class EventBus {
  private listeners = new Map();
  
  emit(event: string, data: any) {/* logic */}
  on(event: string, callback: Function) {/* logic */}
  off(event: string, callback: Function) {/* logic */}
}

// Usage in modules
const eventBus = new EventBus();
eventBus.emit('file:selected', fileData);
```

### 🔌 Plugin Architecture
```typescript
// Plugin interface (max 50 lines)
interface IPlugin {
  name: string;
  version: string;
  activate(): void;
  deactivate(): void;
}

// PluginManager.ts (max 150 lines)
class PluginManager {
  private plugins: Map<string, IPlugin> = new Map();
  
  register(plugin: IPlugin) {/* logic */}
  unregister(pluginName: string) {/* logic */}
  // Max 5-6 methods
}
```

---

## 🎨 Styling & Theming Modularity

### 🎭 CSS Modules Structure
```css
/* Component.module.css (max 100 lines) */
.container { /* styles */ }
.header { /* styles */ }
.content { /* styles */ }

/* If CSS > 100 lines, split: */
/* Component.layout.module.css */
/* Component.theme.module.css */
/* Component.responsive.module.css */
```

### 🌈 Theme System
```typescript
// themes/base.ts (max 100 lines)
export const baseTheme = {
  colors: {/* color definitions */},
  spacing: {/* spacing definitions */},
  typography: {/* font definitions */},
};

// themes/dark.ts, themes/light.ts
// Each theme file max 50-100 lines
```

---

## 🔄 Refactoring Guidelines

### 📏 When to Refactor
1. **File exceeds 150 lines** → Split immediately
2. **Function exceeds 25 lines** → Extract sub-functions
3. **More than 5 parameters** → Use parameter object
4. **Cyclomatic complexity > 10** → Simplify logic
5. **Duplicate code in 3+ places** → Extract to utility

### 🛠️ Refactoring Process
```
1. Write tests for existing functionality
2. Extract small, focused modules
3. Ensure each module has single responsibility
4. Update imports and exports
5. Run tests to verify functionality
6. Update documentation
```

---

## 🎯 Quality Gates

### ✅ Definition of Done Checklist
- [ ] File size ≤ 200 lines
- [ ] Function length ≤ 30 lines
- [ ] Cyclomatic complexity ≤ 10
- [ ] Test coverage ≥ 80%
- [ ] Documentation complete
- [ ] No ESLint errors
- [ ] Performance benchmarks pass
- [ ] Accessibility requirements met

### 🚨 Code Review Checklist
- [ ] Modularity principles followed
- [ ] Single responsibility maintained
- [ ] Dependencies properly injected
- [ ] Error handling implemented
- [ ] Tests comprehensive
- [ ] Documentation updated
- [ ] Performance considered

---

## 🎓 Training & Best Practices

### 📖 Required Reading
1. Clean Code - Robert Martin
2. Clean Architecture - Robert Martin
3. Refactoring - Martin Fowler
4. Component-Driven Development
5. Domain-Driven Design Basics

### 🏆 Code Quality Principles
1. **Boy Scout Rule**: Leave code cleaner than you found it
2. **DRY Principle**: Don't Repeat Yourself
3. **KISS Principle**: Keep It Simple, Stupid
4. **YAGNI Principle**: You Aren't Gonna Need It
5. **SOLID Principles**: For robust architecture

---

## 🚀 Continuous Improvement

### 📊 Metrics to Track
- Average file size
- Function complexity
- Test coverage
- Code duplication percentage
- Build time
- Bundle size
- Performance benchmarks

### 🔄 Regular Reviews
- **Weekly**: Code quality metrics review
- **Monthly**: Architecture review
- **Quarterly**: Major refactoring planning
- **Annually**: Technology stack evaluation

---

*Remember: Modularity is not just about file size - it's about creating maintainable, testable, and scalable code that enables rapid development and easy debugging. Every line of code should have a clear purpose and belong in its rightful place.*

---

**Last Updated**: August 31, 2025  
**Version**: 1.0.0  
**Status**: Living Document - Update Regularly
