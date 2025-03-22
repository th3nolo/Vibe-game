/**
 * Logging utility for the MMO RPG server
 */
export class Logger {
  private static instance: Logger;
  private isDevelopment: boolean;

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  /**
   * Gets the singleton instance of the logger
   */
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Logs an info message
   */
  public info(message: string, ...args: unknown[]): void {
    console.log(`[INFO] ${message}`, ...args);
  }

  /**
   * Logs a warning message
   */
  public warn(message: string, ...args: unknown[]): void {
    console.warn(`[WARN] ${message}`, ...args);
  }

  /**
   * Logs an error message
   */
  public error(message: string, error?: Error): void {
    console.error(`[ERROR] ${message}`, error || '');
    if (error && this.isDevelopment) {
      console.error(error.stack);
    }
  }

  /**
   * Logs a debug message (only in development)
   */
  public debug(message: string, ...args: unknown[]): void {
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }
} 