# Open Collaboration Tools Website

This repository contains the website for [Open Collaboration Tools](https://www.open-collab.tools), an open source platform for collaborative editing in IDEs and custom editors.

## 🌐 Live Website

The website is live at [https://www.open-collab.tools](https://www.open-collab.tools)

## 📁 Project Structure

This project consists of two main components built separately:

- **`hugo/`** - Main website content built with [Hugo](https://gohugo.io/) and the [GeekDoc theme](https://geekdocs.de/)
- **`playground/`** - Interactive OCT Playground built as a React SPA with Vite

### Architecture Overview

```
oct-website/
├── hugo/           # Main website (Hugo static site generator)
├── playground/     # Interactive playground (React + Vite)
├── public/         # Built output (shared between both components)
└── tailwind/       # Shared Tailwind CSS configuration
```

## 🛠️ Development

### Main Website (Hugo)

The main website is built with Hugo and uses the GeekDoc theme for documentation.

```bash
# Navigate to Hugo directory
cd hugo

# Start development server
npm run watch

# Build for production
npm run build
```

**Development server:** http://localhost:1313

### Playground (React SPA)

The playground is a React application that demonstrates the Open Collaboration Tools functionality.

```bash
# Navigate to playground directory
cd playground

# Start development server
npm run dev

# Build for production
npm run build
```

**Development server:** http://localhost:5173

## 📄 License

This repository is part of the Eclipse Open Collaboration Tools project and is licensed under the MIT License.
