// error-handlers.js
// Move inline error filtering from index.html into a module to comply with CSP

// Suppress noisy extension-related errors in Chromium-based browsers
window.addEventListener('error', function (e) {
  try {
    if (
      e &&
      typeof e.message === 'string' &&
      (e.message.includes('runtime.lastError') ||
        e.message.includes('Extension context invalidated') ||
        e.message.includes('message port closed'))
    ) {
      e.preventDefault();
      return true;
    }
  } catch (error) {
    // Silently handle extension-related errors - these are expected
    console.debug('Extension error suppressed:', error.message);
  }
});

// Suppress unhandled promise rejections caused by extensions
window.addEventListener('unhandledrejection', function (e) {
  try {
    if (e && typeof e.reason === 'string' && e.reason.includes('runtime.lastError')) {
      e.preventDefault();
      return true;
    }
  } catch (error) {
    // Silently handle extension-related errors - these are expected
    console.debug('Extension error suppressed:', error.message);
  }
});

export {};
