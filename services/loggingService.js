import fs from "fs";
import path from "path";
import morgan from "morgan";
import winston from "winston";

const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

class LoggingService {
  constructor() {
    // Custom timestamp formatter for local time
    const localTimestamp = winston.format((info) => {
      info.timestamp = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata', // Change to your timezone
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).replace(/(\d+)\/(\d+)\/(\d+),/, '$3-$1-$2');
      return info;
    });

    // Common logger configuration
    const createLogger = (options) => winston.createLogger({
      level: "info",
      exitOnError: false,
      format: winston.format.combine(
        localTimestamp(),
        winston.format.json()
      ),
      ...options
    });

    // Application Logger
    this.appLogger = createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
        }),
        new winston.transports.File({
          filename: path.join(logDir, "app.log"),
          level: "info",
          maxsize: 5 * 1024 * 1024,
          maxFiles: 5,
          tailable: true,
        }),
      ],
    });

    // Request Logger
    this.requestLogger = createLogger({
      transports: [
        new winston.transports.File({
          filename: path.join(logDir, "requests.log"),
          level: "info",
        }),
      ],
    });

    // Morgan middleware remains unchanged
    this.morganLogging = morgan("combined", {
      stream: {
        write: (message) => this.requestLogger.info(message.trim()),
      },
    });

    // Error handlers remain unchanged
    process.on("uncaughtException", (err) => {
      this.logError(`Uncaught Exception: ${err.message}`);
    });

    process.on("unhandledRejection", (reason, promise) => {
      this.logError(`Unhandled Rejection: ${reason}`);
    });

    this.appLogger.info("Logging service initialized");
  }

  // Log methods remain unchanged
  logInfo(message) {
    this.appLogger.info(message);
  }

  logError(message) {
    this.appLogger.error(message);
  }

  logWarning(message) {
    this.appLogger.warn(message);
  }
}

export default new LoggingService();