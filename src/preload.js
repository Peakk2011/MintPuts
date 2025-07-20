const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  getVersion: () => ipcRenderer.invoke('get-app-version'),

  getPerformanceMetrics: () => ipcRenderer.invoke('get-performance-metrics'),

  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),

  selectFile: () => ipcRenderer.invoke('select-file'),
  saveFile: (content) => ipcRenderer.invoke('save-file', content),

  setTheme: (theme) => ipcRenderer.invoke('set-theme', theme),
  getTheme: () => ipcRenderer.invoke('get-theme'),

  isDev: () => ipcRenderer.invoke('is-dev'),
  openDevTools: () => ipcRenderer.invoke('open-dev-tools'),

  onWindowStateChange: (callback) => ipcRenderer.on('window-state-changed', callback),
  onThemeChange: (callback) => ipcRenderer.on('theme-changed', callback),

  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});

if (process.env.NODE_ENV === 'development') {
  contextBridge.exposeInMainWorld('devTools', {
    log: (...args) => ipcRenderer.send('devtools-log', ...args),
    error: (...args) => ipcRenderer.send('devtools-error', ...args),
    warn: (...args) => ipcRenderer.send('devtools-warn', ...args),
    startProfile: (name) => ipcRenderer.send('devtools-profile-start', name),
    endProfile: (name) => ipcRenderer.send('devtools-profile-end', name),
    getMemoryUsage: () => ipcRenderer.invoke('get-performance-metrics'),
    time: (label) => ipcRenderer.send('devtools-time', label),
    timeEnd: (label) => ipcRenderer.send('devtools-timeEnd', label)
  });
}

window.addEventListener('error', (event) => {
  console.error('Global error occurred');
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection');
});

document.addEventListener('DOMContentLoaded', () => {
  const unusedStyleSheets = Array.from(document.styleSheets).filter(sheet => {
    try {
      return sheet.cssRules.length === 0;
    } catch (e) {
      return false;
    }
  });

  unusedStyleSheets.forEach(sheet => {
    if (sheet.ownerNode) {
      sheet.ownerNode.remove();
    }
  });

  // Lazy load images
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
});