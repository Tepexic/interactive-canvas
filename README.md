# Interactive Canvas - Visual Workflow Builder

A modern, interactive visual workflow builder built with React and TypeScript. Create, configure, and execute automated workflows using a drag-and-drop interface powered by React Flow.

## 🚀 Live Demo

**[Try it live on GitHub Pages](https://tepexic.github.io/interactive-canvas/)**

## ✨ Features

- **🎨 Visual Workflow Designer** - Drag and drop interface for building automation flows
- **🔧 Node Configuration** - Configure each workflow step with custom parameters
- **▶️ Flow Execution** - Execute workflows with real-time status updates and visual feedback
- **🔄 Smart Validation** - Automatic validation of flow connectivity and node configurations
- **💾 Persistent Storage** - Automatically saves workflows to local storage

## 🧩 Available Node Types

- **📧 Gmail Block** - Send emails with custom recipients, subjects, and messages
- **💬 Slack Block** - Send messages to Slack channels
- **🤖 AI Agent Block** - Process data with AI-powered analysis and recommendations
- **📊 Amazon Sales Report Block** - Pull sales data with configurable metrics and timeframes

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Canvas Library**: React Flow (@xyflow/react)
- **State Management**: Zustand
- **UI Components**: Headless UI
- **Icons**: Hero Icons
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Deployment**: GitHub Pages with automated CI/CD

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Tepexic/interactive-canvas.git
   cd interactive-canvas
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🎯 How to Use

1. **Add Nodes**: Drag blocks from the palette onto the canvas
2. **Configure Nodes**: Click the gear icon on any node to configure its settings
3. **Connect Nodes**: Drag from one node's output to another node's input to create connections
4. **Execute Flow**: Click "Execute Flow" to run your workflow
5. **Monitor Progress**: Watch real-time status updates as your workflow executes

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── canvas/         # Canvas-specific components (nodes, edges, palette)
│   ├── modals/         # Modal dialogs (configuration, alerts, confirmations)
│   └── layout/         # Layout components (app bar)
├── hooks/              # Custom React hooks
├── stores/             # Zustand state management
├── types/              # TypeScript type definitions
└── utils/              # Utility functions (validation, storage, etc.)
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- **[Live Demo](https://tepexic.github.io/interactive-canvas/)**
- **[GitHub Repository](https://github.com/Tepexic/interactive-canvas)**
- **[Issues & Feature Requests](https://github.com/Tepexic/interactive-canvas/issues)**

---

Built with ❤️ using React, TypeScript, and React Flow
