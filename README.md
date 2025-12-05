# Merchant Workbench

Basic Electron application scaffold for the Merchant Workbench desktop app.

## Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm (comes with Node.js)

## Install dependencies
```bash
npm install
```

## Run the app
Start the Electron app in development mode:
```bash
npm start
```
This runs `electron .` using the configuration in `package.json`.

## Project structure
- `main.js`: Electron main process that creates the browser window.
- `preload.js`: Preload script for the renderer.
- `renderer.js`: Renderer-side logic for the UI loaded by `index.html`.
- `index.html`: HTML entry point for the renderer.
