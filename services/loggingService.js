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
    this.appLogger = winston.createLogger({
      level: "info",
      exitOnError: false,
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.json()
      ),
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

    this.requestLogger = winston.createLogger({
      level: "info",
      exitOnError: false,
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({
          filename: path.join(logDir, "requests.log"),
          level: "info",
        }),
      ],
    });

    this.morganLogging = morgan("combined", {
      stream: {
        write: (message) => this.requestLogger.info(message.trim()),
      },
    });

    process.on("uncaughtException", (err) => {
      this.logError(`Uncaught Exception: ${err.message}`);
    });

    process.on("unhandledRejection", (reason, promise) => {
      this.logError(`Unhandled Rejection: ${reason}`);
    });

    console.log("Logging service initialized.");
    this.appLogger.info("Logging service initialized successfully!");
  }

  logInfo(message) {
    console.log("Logging Info:", message);
    this.appLogger.info(message);
  }

  logError(message) {
    console.error("Logging Error:", message);
    this.appLogger.error(message);
  }

  logWarning(message) {
    console.warn("Logging Warning:", message);
    this.appLogger.warn(message);
  }
}

export default new LoggingService();
