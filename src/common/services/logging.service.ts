import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export enum LogLevelEnum {
  ERROR = 'error',
  WARN = 'warn',
  LOG = 'log',
  DEBUG = 'debug',
  VERBOSE = 'verbose',
}

@Injectable()
export class LoggingService implements LoggerService {
  private logLevel: LogLevelEnum;
  private logDir: string;
  private maxFileSize: number; // in KB
  private logFile: string;
  private errorLogFile: string;

  constructor() {
    this.logLevel = (process.env.LOG_LEVEL as LogLevelEnum) || LogLevelEnum.LOG;
    this.logDir = process.env.LOG_DIR || path.join(process.cwd(), 'logs');
    this.maxFileSize =
      parseInt(process.env.LOG_MAX_FILE_SIZE_KB || '100', 10) * 1024; // Convert KB to bytes
    this.logFile = path.join(this.logDir, 'app.log');
    this.errorLogFile = path.join(this.logDir, 'error.log');

    // Create log directory if it doesn't exist
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private shouldLog(level: LogLevelEnum): boolean {
    const levels = [
      LogLevelEnum.ERROR,
      LogLevelEnum.WARN,
      LogLevelEnum.LOG,
      LogLevelEnum.DEBUG,
      LogLevelEnum.VERBOSE,
    ];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex <= currentLevelIndex;
  }

  private rotateLogFile(filePath: string): void {
    if (!fs.existsSync(filePath)) {
      return;
    }

    const stats = fs.statSync(filePath);
    if (stats.size >= this.maxFileSize) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const rotatedFile = `${filePath}.${timestamp}`;
      fs.renameSync(filePath, rotatedFile);
    }
  }

  private writeLog(
    level: LogLevelEnum,
    message: string,
    context?: string,
    stack?: string,
  ): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}]` : '';
    const logMessage = `${timestamp} ${level.toUpperCase()} ${contextStr} ${message}`;
    const fullMessage = stack ? `${logMessage}\n${stack}` : logMessage;

    // Write to stdout
    if (level === LogLevelEnum.ERROR) {
      process.stdout.write(`\x1b[31m${fullMessage}\x1b[0m\n`);
    } else if (level === LogLevelEnum.WARN) {
      process.stdout.write(`\x1b[33m${fullMessage}\x1b[0m\n`);
    } else {
      process.stdout.write(`${fullMessage}\n`);
    }

    // Write to file
    try {
      const targetFile =
        level === LogLevelEnum.ERROR ? this.errorLogFile : this.logFile;
      this.rotateLogFile(targetFile);
      fs.appendFileSync(targetFile, `${fullMessage}\n`, 'utf8');
    } catch (error) {
      // Fallback to stdout if file write fails
      process.stdout.write(`Failed to write log to file: ${error}\n`);
    }
  }

  log(message: string, context?: string): void {
    this.writeLog(LogLevelEnum.LOG, message, context);
  }

  error(message: string, stack?: string, context?: string): void {
    this.writeLog(LogLevelEnum.ERROR, message, context, stack);
  }

  warn(message: string, context?: string): void {
    this.writeLog(LogLevelEnum.WARN, message, context);
  }

  debug(message: string, context?: string): void {
    this.writeLog(LogLevelEnum.DEBUG, message, context);
  }

  verbose(message: string, context?: string): void {
    this.writeLog(LogLevelEnum.VERBOSE, message, context);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setLogLevels(_levels: LogLevel[]): void {
    // This method is required by LoggerService interface
    // We use environment variable instead
  }
}
