import morgan from 'morgan';
import winston from 'winston';

class LoggingService {
  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'app.log' })
      ]
    });

    this.morganLogging = morgan('combined', {
      stream: {
        write: (message) => this.logger.info(message.trim()) // Fix: Use `this.logger`
      }
    });
  }

  logInfo(message) {
    this.logger.info(message);
  }

  logError(message) {
    this.logger.error(message);
  }

  logWarning(message) {
    this.logger.warn(message);
  }
}

export default new LoggingService();
