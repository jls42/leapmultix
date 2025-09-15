/**
 * Système de logging simple pour LeapMultix
 * Permet de tracer les actions et erreurs pendant la refactorisation
 */

export const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

export class Logger {
  constructor(level = LogLevel.INFO) {
    this.level = level;
    this.logs = [];
  }

  log(level, message, data = null) {
    if (level < this.level) return;

    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: this.getLevelName(level),
      message,
      data,
    };

    this.logs.push(logEntry);
    // Bound the in-memory log size to avoid unbounded growth in long sessions
    if (this.logs.length > 1000) this.logs.shift();

    // Console output avec couleurs (développement uniquement)
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
      const color = this.getLevelColor(level);
      console.log(
        `%c[${timestamp}] ${this.getLevelName(level)}: ${message}`,
        `color: ${color}`,
        data || ''
      );
    }
  }

  debug(message, data) {
    this.log(LogLevel.DEBUG, message, data);
  }

  info(message, data) {
    this.log(LogLevel.INFO, message, data);
  }

  warn(message, data) {
    this.log(LogLevel.WARN, message, data);
  }

  error(message, data) {
    this.log(LogLevel.ERROR, message, data);
  }

  getLevelName(level) {
    const names = ['DEBUG', 'INFO', 'WARN', 'ERROR'];

    return names[level] || 'UNKNOWN';
  }

  getLevelColor(level) {
    const colors = ['#888', '#007bff', '#ffc107', '#dc3545'];

    return colors[level] || '#000';
  }

  // Exporter les logs pour analyse
  exportLogs() {
    return JSON.stringify(this.logs, null, 2);
  }

  // Sauvegarder les logs dans localStorage
  saveLogs() {
    try {
      localStorage.setItem('leapmultix_logs', this.exportLogs());
    } catch (e) {
      console.error('Impossible de sauvegarder les logs:', e);
    }
  }

  // Charger les logs depuis localStorage
  loadLogs() {
    try {
      const saved = localStorage.getItem('leapmultix_logs');
      if (saved) {
        this.logs = JSON.parse(saved);
      }
    } catch (e) {
      console.error('Impossible de charger les logs:', e);
    }
  }
}

// Instance ESM
const logger = new Logger(LogLevel.INFO);
export { logger };
