import morgan from 'morgan';
import winston from 'winston';

class LoggingService{
    logger = winston.createLogger({
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
    morganlogging =  morgan('combined', {
      stream: {
        write: (message) => logger.info(message.trim())
      }
    })
}