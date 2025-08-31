# CodeForge IDE

<div align="center">

**A next-generation code editor built for modern developers**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/github/workflow/status/codeforge/codeforge-ide/CI)](https://github.com/codeforge/codeforge-ide/actions)
[![Version](https://img.shields.io/github/v/release/codeforge/codeforge-ide)](https://github.com/codeforge/codeforge-ide/releases)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Rust](https://img.shields.io/badge/Rust-000000?logo=rust&logoColor=white)](https://www.rust-lang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tauri](https://img.shields.io/badge/Tauri-24C8DB?logo=tauri&logoColor=white)](https://tauri.app/)

[**Download**](https://github.com/codeforge/codeforge-ide/releases) • [**Documentation**](https://docs.codeforge.dev) • [**Contributing**](CONTRIBUTING.md) • [**Roadmap**](TODO.md)

</div>

## 🚀 Overview

CodeForge IDE is a modern, fast, and extensible code editor that aims to rival VS Code while providing native performance through Tauri and a beautiful, responsive UI built with React. Designed with radical modularity principles, every component is crafted for maintainability, testability, and extensibility.

### ✨ Key Features

- 🏎️ **Native Performance**: Built on Tauri for blazing-fast startup and minimal resource usage
- 🎨 **Modern UI**: Beautiful, responsive interface built with React and TypeScript
- 🔧 **Highly Extensible**: Plugin architecture supporting custom extensions and themes
- 🌐 **Multi-Language Support**: Advanced language server protocol integration
- 🔍 **Intelligent Search**: Global search, quick open, and symbol navigation
- 🖥️ **Integrated Terminal**: Full terminal integration with multiple shell support
- 🔀 **Git Integration**: Built-in version control with visual diff and merge tools
- 🎭 **Customizable**: Themes, layouts, and keybindings tailored to your workflow
- 📱 **Cross-Platform**: Windows, macOS, and Linux support

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Rust + Tauri 2.0
- **State Management**: Redux Toolkit
- **Styling**: CSS Modules
- **Testing**: Jest + React Testing Library + Playwright
- **Code Quality**: ESLint + Prettier + Husky

## 🎯 Project Status

Currently in **Phase 1 - Foundation** development. See our [detailed roadmap](TODO.md) for upcoming features and milestones.

### Completed ✅
- [x] Project initialization and setup
- [x] Basic Tauri + React integration
- [x] TypeScript configuration
- [x] Development guidelines and architecture

### In Progress 🚧
- [ ] Core component library
- [ ] File system integration
- [ ] Basic editor functionality
- [ ] Theme system

### Planned 📋
- [ ] Extension system
- [ ] Git integration
- [ ] Language server support
- [ ] Debugging tools

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or later)
- **pnpm** (recommended) or npm
- **Rust** (latest stable)
- **Platform-specific dependencies**:
  - **Windows**: Microsoft Visual Studio C++ Build Tools
  - **macOS**: Xcode Command Line Tools
  - **Linux**: Development packages (see [Tauri prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/codeforge/codeforge-ide.git
   cd codeforge-ide
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm tauri dev
   ```

4. **Build for production**
   ```bash
   pnpm tauri build
   ```

## 📖 Development

### Project Structure

```
codeforge2/
├── src/                    # React frontend source
│   ├── components/         # Reusable UI components
│   ├── features/           # Feature-specific modules
│   ├── hooks/              # Custom React hooks
│   ├── services/           # Business logic services
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── src-tauri/              # Rust backend source
│   ├── src/                # Rust source code
│   ├── capabilities/       # Tauri capabilities
│   └── icons/              # Application icons
├── public/                 # Static assets
└── docs/                   # Documentation
```

### Code Quality Guidelines

We follow strict modularity principles outlined in [AGENTS.md](AGENTS.md):

- **Maximum file size**: 200 lines
- **Function length**: Maximum 30 lines
- **Single responsibility**: Each module has one clear purpose
- **Comprehensive testing**: 80%+ test coverage required

### Scripts

```bash
# Development
pnpm dev              # Start frontend development server
pnpm tauri dev        # Start full application in development mode

# Building
pnpm build            # Build frontend for production
pnpm tauri build      # Build complete application

# Code Quality
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
pnpm test             # Run tests
pnpm test:e2e         # Run end-to-end tests

# Type Checking
pnpm type-check       # Run TypeScript compiler check
```

## 🧪 Testing

Our testing strategy includes:

- **Unit Tests**: Jest + React Testing Library for component testing
- **Integration Tests**: API and service integration testing
- **E2E Tests**: Playwright for full application testing
- **Performance Tests**: Benchmarking and memory usage testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run E2E tests
pnpm test:e2e
```

## 🎨 Theming & Customization

CodeForge supports extensive customization:

- **Themes**: Dark, light, and custom color schemes
- **Layouts**: Customizable panel arrangements
- **Keybindings**: Fully customizable keyboard shortcuts
- **Extensions**: Plugin system for additional functionality

## 🔧 Configuration

Application settings are managed through:

- **User Settings**: Global preferences (`~/.codeforge/settings.json`)
- **Workspace Settings**: Project-specific configurations (`.codeforge/settings.json`)
- **Extension Settings**: Plugin-specific configurations

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details on:

- Code of conduct
- Development setup
- Pull request process
- Issue reporting guidelines
- Architecture decisions

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow our coding standards and write tests
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📚 Documentation

- [**User Guide**](docs/user-guide.md) - How to use CodeForge IDE
- [**Developer Documentation**](docs/developer.md) - Technical implementation details
- [**API Reference**](docs/api.md) - Extension development API
- [**Architecture Guide**](docs/architecture.md) - System design and principles
- [**Roadmap**](TODO.md) - Feature development timeline

## 🐛 Issues & Support

- **Bug Reports**: [GitHub Issues](https://github.com/codeforge/codeforge-ide/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/codeforge/codeforge-ide/discussions)
- **Community**: [Discord Server](https://discord.gg/codeforge)
- **Documentation**: [Official Docs](https://docs.codeforge.dev)

## 📊 Performance

CodeForge is designed for performance:

- **Startup Time**: < 3 seconds cold start
- **Memory Usage**: < 200MB baseline
- **File Opening**: < 500ms for files up to 10MB
- **Large Files**: Efficient handling up to 100MB

## 🗺️ Roadmap

Our development is organized into phases:

- **Phase 1**: Core Infrastructure & Foundation *(Current)*
- **Phase 2**: File Management & Explorer
- **Phase 3**: Code Editor Core
- **Phase 4**: Search & Navigation
- **Phase 5**: Terminal Integration

See the complete [development roadmap](TODO.md) for detailed milestones.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **VS Code**: Inspiration for features and user experience
- **Tauri**: Amazing framework for building native applications
- **Monaco Editor**: Powerful code editing component
- **Rust Community**: Excellent ecosystem and tools
- **React Community**: Modern UI development practices

## 📞 Contact

- **Website**: [codeforge.dev](https://codeforge.dev)
- **Twitter**: [@CodeForgeIDE](https://twitter.com/CodeForgeIDE)
- **Email**: [hello@codeforge.dev](mailto:hello@codeforge.dev)

---

<div align="center">

**Built with ❤️ by the CodeForge team**

[⭐ Star us on GitHub](https://github.com/codeforge/codeforge-ide) • [🐦 Follow on Twitter](https://twitter.com/CodeForgeIDE) • [💬 Join Discord](https://discord.gg/codeforge)

</div>
