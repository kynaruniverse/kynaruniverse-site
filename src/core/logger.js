export const Logger = {
  isDev: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
  log(...args) {
    if (this.isDev) console.log(...args);
  },
  warn(...args) {
    if (this.isDev) console.warn(...args);
  },
  error(...args) {
    console.error(...args); // Always show errors
  }
};

// Then replace all console.log with Logger.log