// Types for log levels
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Configuration interface
interface LoggingConfig {
  level: LogLevel;
  enabled: boolean;
  includeTimestamp: boolean;
  includeLocation: boolean;
}

// Default configuration
const defaultConfig: LoggingConfig = {
  level: 'info',
  enabled: process.env.NODE_ENV !== 'production',
  includeTimestamp: true,
  includeLocation: true,
};

// Log level priorities
const logLevels: { [key in LogLevel]: number } = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  private config: LoggingConfig;

  constructor(config?: Partial<LoggingConfig>) {
    this.config = { ...defaultConfig, ...config };
  }

  // Get current log level priority
  private getLevelPriority(level: LogLevel): number {
    return logLevels[level] || 1;
  }

  // Check if logging is enabled for the given level
  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled) return false;
    return this.getLevelPriority(level) >= this.getLevelPriority(this.config.level);
  }

  // Get timestamp string
  private getTimestamp(): string {
    if (!this.config.includeTimestamp) return '';
    return new Date().toISOString();
  }

  // Get location info (file and line number)
  private getLocation(): string {
    if (!this.config.includeLocation) return '';

    // Get the stack trace
    const stack = new Error().stack;
    if (!stack) return '';

    // Parse the stack to get the caller location
    const stackLines = stack.split('\n');
    // The third line typically contains the caller info (after Error and Logger constructor)
    if (stackLines.length >= 4) {
      const callerLine = stackLines[3].trim();
      // Extract file and line info from the stack trace
      const match = callerLine.match(/\((.+):(\d+):(\d+)\)/) || callerLine.match(/at (.+):(\d+):(\d+)\)?/);
      if (match) {
        const filePath = match[1].split('/').pop() || match[1].split('\\').pop() || 'unknown';
        return `${filePath}`;
      }
    }

    return 'unknown';
  }

  // Format log message
  private formatMessage(level: LogLevel, message: string, meta?: any): string {
    const parts = [];

    if (this.config.includeTimestamp) {
      parts.push(`[${this.getTimestamp()}]`);
    }

    parts.push(`[${level.toUpperCase()}]`);

    if (this.config.includeLocation) {
      const location = this.getLocation();
      if (location && !location.includes('logging.ts')) {
        parts.push(`[${location}]`);
      }
    }

    parts.push(message);

    const formatted = parts.join(' ');

    if (meta !== undefined) {
      return `${formatted} ${JSON.stringify(meta)}`;
    }

    return formatted;
  }

  // Log method
  private log(level: LogLevel, message: string, meta?: any): void {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(level, message, meta);

    switch (level) {
      case 'debug':
        console.debug(formattedMessage);
        break;
      case 'info':
        console.info(formattedMessage);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'error':
        console.error(formattedMessage);
        break;
      default:
        console.log(formattedMessage);
    }
  }

  // Public logging methods
  debug(message: string, meta?: any): void {
    this.log('debug', message, meta);
  }

  info(message: string, meta?: any): void {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: any): void {
    this.log('warn', message, meta);
  }

  error(message: string, meta?: any): void {
    this.log('error', message, meta);
  }

  // Update configuration
  updateConfig(config: Partial<LoggingConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// Create a singleton logger instance
export const logger = new Logger();

// Export the Logger class for creating custom instances if needed
export { Logger };

// Type for analytics events
interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp?: Date;
}

// Simple analytics service
class AnalyticsService {
  private enabled: boolean;
  private userId: string | null = null;

  constructor(enabled: boolean = process.env.NODE_ENV !== 'production') {
    this.enabled = enabled;
  }

  setUserId(userId: string): void {
    this.userId = userId;
  }

  track(event: AnalyticsEvent): void {
    if (!this.enabled) return;

    const eventData = {
      event: event.event,
      properties: event.properties || {},
      userId: event.userId || this.userId,
      timestamp: event.timestamp || new Date(),
    };

    // Log the event
    logger.info(`Analytics event: ${eventData.event}`, eventData);

    // In a real implementation, you would send this to an analytics service
    // For now, we'll just log it
    if (typeof window !== 'undefined' && (window as any).gtag) {
      // Google Analytics gtag implementation
      (window as any).gtag('event', eventData.event, {
        ...eventData.properties,
        user_id: eventData.userId,
      });
    }
  }
}

export const analytics = new AnalyticsService();