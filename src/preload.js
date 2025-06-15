const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App info
  getVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // Performance utilities
  getPerformanceMetrics: () => {
    return {
      memory: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      timestamp: Date.now()
    };
  },

  // Window controls
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),

  // File operations (if needed)
  selectFile: () => ipcRenderer.invoke('select-file'),
  saveFile: (content) => ipcRenderer.invoke('save-file', content),

  // Theme management
  setTheme: (theme) => ipcRenderer.invoke('set-theme', theme),
  getTheme: () => ipcRenderer.invoke('get-theme'),

  // Development utilities
  isDev: () => ipcRenderer.invoke('is-dev'),
  openDevTools: () => ipcRenderer.invoke('open-dev-tools'),

  // Event listeners
  onWindowStateChange: (callback) => ipcRenderer.on('window-state-changed', callback),
  onThemeChange: (callback) => ipcRenderer.on('theme-changed', callback),

  // Cleanup
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});

// Performance monitoring
if (process.env.NODE_ENV === 'development') {
  contextBridge.exposeInMainWorld('devTools', {
    log: (...args) => console.log('[Preload]', ...args),
    error: (...args) => console.error('[Preload]', ...args),
    warn: (...args) => console.warn('[Preload]', ...args),
    
    // Performance profiling
    startProfile: (name) => console.profile(name),
    endProfile: (name) => console.profileEnd(name),
    
    // Memory tracking
    getMemoryUsage: () => process.memoryUsage(),
    
    // Timing utilities
    time: (label) => console.time(label),
    timeEnd: (label) => console.timeEnd(label)
  });
}

// Global error handling
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Optimize loading
document.addEventListener('DOMContentLoaded', () => {
  // Performance optimization: Remove unused CSS
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