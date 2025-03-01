// main.js
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { createServer } = require("./server");

const isDev = process.env.NODE_ENV === 'development';
const serverPort = 3001;
let mainWindow = null;

// Start server and create window when Electron is ready
async function startApp() {
  try {
    // Start the server
    const server = createServer();
    await new Promise((resolve, reject) => {
      const expressServer = server.listen(serverPort, (err) => {
        if (err) {
          console.error('Failed to start server:', err);
          reject(err);
          return;
        }
        console.log(`Express server running on http://localhost:${serverPort}`);
        resolve(expressServer);
      });
    });

    // Create the main window
    createMainWindow();
  } catch (err) {
    console.error('Failed to start application:', err);
    app.quit();
  }
}

// Create the main browser window
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 840,
    frame: false,
    backgroundColor: '#1a1a1a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    show: false,
  });
  
  // Create splash screen window
  const splashScreen = new BrowserWindow({
    width: 500,
    height: 400,
    frame: false,
    center: true,
    resizable: false,
    skipTaskbar: true,
    webPreferences: {
      contextIsolation: true
    }
  });

  // Load the splash screen
  splashScreen.loadFile(path.join(__dirname, 'splash.html'));

  // Always use the Vite dev server URL when in development mode
  const loadURL = isDev 
    ? 'http://localhost:3000' 
    : `http://localhost:${serverPort}`;

  console.log('Loading URL:', loadURL);
  mainWindow.loadURL(loadURL);

  // Add load event handlers for debugging
  mainWindow.webContents.on('did-start-loading', () => {
    console.log('Window started loading');
  });

  // Once the main window is ready, show it and close the splash screen
  mainWindow.webContents.on('did-finish-load', () => {
    setTimeout(() => {
      mainWindow.show();
      splashScreen.close();
    }, 800); // Small delay for smoother transition
  });

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Window failed to load:', errorCode, errorDescription);
    
    // If we're in development mode, we might be using the Vite server
    if (isDev && errorCode === -102 && !process.env.ELECTRON_START_URL) {
      console.log('Trying fallback to Vite dev server...');
      mainWindow.loadURL('http://localhost:3000');
    } else {
      // Show an error page
      mainWindow.loadURL(`data:text/html,
        <html>
        <head><title>Error Loading PromptKit</title></head>
        <body style="font-family: sans-serif; padding: 2rem; background: #f5f5f5;">
          <h1 style="color: #e00;">Error Loading Application</h1>
          <p>There was a problem loading the PromptKit application:</p>
          <pre style="background: #333; color: #fff; padding: 1rem; border-radius: 4px;">
            Error ${errorCode}: ${errorDescription}
          </pre>
          <p>Please check the console for more details.</p>
        </body>
        </html>
      `);
    }
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Initialize the application
app.whenReady().then(async () => {
  await startApp(); // Ensure startApp is awaited

  // Handle window control events
  ipcMain.on('window:minimize', () => {
    if (mainWindow) mainWindow.minimize();
  });

  ipcMain.on('window:maximize', () => {
    if (mainWindow) {
      mainWindow.isMaximized() ? mainWindow.restore() : mainWindow.maximize();
    }
  });

  ipcMain.on('window:close', () => {
    if (mainWindow) mainWindow.close();
  });

  ipcMain.handle('window:isMaximized', () => mainWindow?.isMaximized() || false);
});

// Quit when all windows are closed, except on macOS
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// On macOS, re-create a window if the dock icon is clicked
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) startApp();
});