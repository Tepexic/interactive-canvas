<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is an **Interactive Canvas** React + TypeScript single-page application for building visual workflow diagrams with drag-and-drop functionality. The application allows users to create, configure, and execute flows with various block types (Amazon, Gmail, AI Agent, Slack).

### Tech Stack
- **Frontend**: React 19 + TypeScript
- **State Management**: Zustand
- **UI Framework**: Headless UI + Hero Icons
- **Canvas Library**: @xyflow/react (ReactFlow)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Security**: DOMPurify + validator for input sanitization

## Architecture

### Core Components
- **Canvas**: Main interactive flow builder using ReactFlow
- **CustomNode**: Configurable workflow blocks with hover controls
- **CustomEdge**: Connections between workflow blocks
- **CanvasToolbar**: Block creation and flow execution controls
- **ConfigurationModal**: Block-specific settings configuration

### State Management
- **canvasStore**: Zustand store managing nodes, edges, and canvas state
- Local storage persistence for canvas state
- Debounced auto-save functionality

### Block Types
- **Amazon Sales Report**: Pull sales data with configurable metrics
- **AI Agent**: Process data with customizable prompts (with security sanitization)
- **Gmail**: Send emails with recipient/subject/message configuration
- **Slack**: Team communication with channel/message settings

## Development Guidelines

### Code Style
- Use TypeScript for all files with strict typing
- Implement functional components with React hooks
- Use Zustand stores for state management (avoid useState for global state)
- Follow Headless UI patterns for accessible components
- Use Hero Icons for consistent iconography

### File Organization
```
src/
├── components/
│   ├── canvas/          # Canvas-related components
│   ├── modals/          # Modal dialogs and forms
│   └── layout/          # Layout components
├── stores/              # Zustand state stores
├── types/               # TypeScript type definitions
├── utils/               # Utility functions and constants
└── assets/              # Static assets (images, icons)
```

### Security Considerations
- Always sanitize AI prompts using `promptSanitizer` utility
- Validate user inputs with the validator library
- Use DOMPurify for HTML sanitization when needed
- Follow principle of least privilege for API integrations

### Component Patterns
- Keep components pure and testable
- Use proper TypeScript interfaces for props
- Implement proper error boundaries
- Use React.memo for performance optimization where needed
- Follow accessibility guidelines with Headless UI

### Canvas Development
- Use ReactFlow's built-in types and utilities
- Implement custom node types with proper handle positioning
- Maintain node/edge relationships in Zustand store
- Implement proper drag and drop functionality
- Handle canvas zoom and pan interactions

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (TypeScript check + Vite build)
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Project Status

- [x] Initial project setup complete
- [x] Zustand stores implemented (canvasStore with persistence)
- [x] UI components with Headless UI (modals, forms, menus)
- [x] Hero Icons integration throughout
- [x] Canvas functionality with ReactFlow
- [x] Custom node types with configuration
- [x] Block type system (Amazon, AI, Gmail, Slack)
- [x] Security sanitization for AI inputs
- [x] Local storage persistence
- [x] Development workflow configured
- [ ] Testing infrastructure setup
- [ ] API integrations for block execution
- [ ] Advanced canvas features (grouping, templates)
- [ ] Export/import functionality
