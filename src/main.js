const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('node:path');
const isDev = require('electron-is-dev');
const v8 = require('v8');
const os = require('os');
const { performance } = require('perf_hooks');
const { nativeTheme } = require('electron');

if (require('electron-squirrel-startup')) {
  app.quit();
}

if (isDev) {
  const path = require('path');
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '../node_modules/.bin/electron'),
    hardResetMethod: 'exit'
  });
}

app.commandLine.appendSwitch('--enable-features', 'VaapiVideoDecoder');
app.commandLine.appendSwitch('--disable-features', 'VizDisplayCompositor');
app.commandLine.appendSwitch('--enable-gpu-rasterization');
app.commandLine.appendSwitch('--enable-zero-copy');
app.commandLine.appendSwitch('--ignore-gpu-blacklist');
app.commandLine.appendSwitch('--enable-accelerated-2d-canvas');
app.commandLine.appendSwitch('--enable-native-gpu-memory-buffers');

const PERFORMANCE_CONFIG = {
  memory: {
    minFreeMemMB: 128,
    maxHeapSize: Math.min(os.totalmem() * 0.6, 4096 * 1024 * 1024),
    initialHeapSize: 256 * 1024 * 1024
  }
};

const memoryManager = {
  checkMemory: () => {
    const usedMemory = process.memoryUsage();
    const maxMemory = v8.getHeapStatistics().heap_size_limit;
    const memoryUsagePercent = (usedMemory.heapUsed / maxMemory) * 100;
    if (memoryUsagePercent > 75) {
      global.gc && global.gc();
      v8.setFlagsFromString('--max_old_space_size=2048');
      app.commandLine.appendSwitch('js-flags', '--expose-gc --max-old-space-size=2048');
    }
  },
  optimizeMemory: () => {
    v8.setFlagsFromString('--optimize_for_size');
    v8.setFlagsFromString('--max_old_space_size=2048');
    v8.setFlagsFromString('--initial_old_space_size=256');
    v8.setFlagsFromString('--max_semi_space_size=128');
  }
};

const enhancedMemoryManager = {
  ...memoryManager,
  getMemoryInfo: () => {
    const free = os.freemem();
    const total = os.totalmem();
    return {
      free,
      total,
      usage: ((total - free) / total) * 100
    };
  },
  optimizeHeap: () => {
    if (global.gc) {
      performance.mark('gc-start');
      global.gc();
      performance.mark('gc-end');
      performance.measure('Garbage Collection', 'gc-start', 'gc-end');
    }
    v8.setFlagsFromString('--max_old_space_size=' + Math.floor(PERFORMANCE_CONFIG.memory.maxHeapSize / (1024 * 1024)));
    v8.setFlagsFromString('--initial_old_space_size=' + Math.floor(PERFORMANCE_CONFIG.memory.initialHeapSize / (1024 * 1024)));
  },
  monitorMemory: () => {
    const memInfo = enhancedMemoryManager.getMemoryInfo();
    if (memInfo.free < PERFORMANCE_CONFIG.memory.minFreeMemMB * 1024 * 1024) {
      enhancedMemoryManager.optimizeHeap();
    }
  }
};

setInterval(enhancedMemoryManager.monitorMemory, 60000);
enhancedMemoryManager.optimizeHeap();

const Mintputs_links = {
  Error: {
    ErrorPage: 'error.html'
  }
};

// Error handler
const handleError = async (win, error, context = '') => {
  console.error(`Error in ${context}:`, error);
  if (win && !win.isDestroyed()) {
    try {
      await win.webContents.send('error-notification', {
        message: error.message || 'An error occurred',
        context: context
      });
      if (context !== 'error-page-load') {
        await win.loadFile(path.join(__dirname, Mintputs_links.Error.ErrorPage));
      }
    } catch (e) {
      console.error('Error handler failed:', e);
    }
  }
  return Promise.reject(error);
};

// Promise-based window creation
const createWindowWithPromise = (config) => {
  return new Promise((resolve, reject) => {
    try {
      const window = new BrowserWindow(config);
      resolve(window);
    } catch (err) {
      reject(err);
    }
  });
};

// Safe file loader for windows
const safeLoad = async (win, filePath) => {
  try {
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      await win.loadURL(filePath);
      return true;
    }
    const fullPath = path.join(__dirname, filePath);
    if (require('fs').existsSync(fullPath)) {
      await win.loadFile(fullPath);
      return true;
    } else {
      console.warn(`File not found: ${filePath}`);
      await win.loadFile(path.join(__dirname, Mintputs_links.Error.ErrorPage));
      return false;
    }
  } catch (err) {
    console.error('SafeLoad error:', err);
    await win.loadFile(path.join(__dirname, Mintputs_links.Error.ErrorPage));
    return false;
  }
};

// Global unhandled promise rejection handler
process.on('unhandledRejection', async (reason, promise) => {
  console.error('Unhandled Promise Rejection:', reason);
  // Attempt to show error in the first window if available
  const win = BrowserWindow.getAllWindows()[0];
  if (win) {
    await handleError(win, reason, 'unhandled-rejection');
  }
});

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 740,
    height: 860,
    minWidth: 345,
    minHeight: 520,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      enableRemoteModule: false,
    },
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'hidden',
    ...(process.platform === 'win32' && {
      titleBarOverlay: {
        color: '#141414',
        symbolColor: '#ffffff',
        height: 30
      }
    })
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
  }

  if (isDev) {
    mainWindow.webContents.on('did-finish-load', () => {
      console.log('Window loaded successfully');
    });

    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      console.error('Failed to load:', errorDescription);
    });
  }

  if (!isDev) {
    Menu.setApplicationMenu(null);
  }

  return mainWindow;
};

app.whenReady().then(() => {
  performance.mark('app-start');
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
  performance.mark('app-ready');
  performance.measure('App Launch', 'app-start', 'app-ready');
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (navigationEvent, url) => {
    navigationEvent.preventDefault();
    console.log('Blocked new window:', url);
  });
});

app.on('before-quit', () => {
  const windows = BrowserWindow.getAllWindows();
  windows.forEach(window => {
    if (window && !window.isDestroyed()) {
      window.removeAllListeners();
    }
  });
});

if (isDev) {
  app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    event.preventDefault();
    callback(true);
  });
}

if (!isDev) {
  app.on('render-process-gone', (event, webContents, details) => {
    console.log('Render process gone:', details);
  });
}

const updateAllWindowsTheme = (theme) => {
  BrowserWindow.getAllWindows().forEach(win => {
    if (!win.isDestroyed()) {
      try {
        win.setTitleBarOverlay({
          color: theme === 'dark' ? '#0f0f0f' : '#e8e7e3',
          symbolColor: theme === 'dark' ? '#e8e7e3' : '#000000',
          height: 30
        });
      } catch (err) {
        console.error('Failed to update window theme:', err);
      }
    }
  });
};

// รับ event เปลี่ยนธีม titlebar จาก renderer
ipcMain.on('titlebar-theme-change', (event, theme) => {
  updateAllWindowsTheme(theme);
});