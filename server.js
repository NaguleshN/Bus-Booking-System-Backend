import express from 'express';
import morgan from 'morgan';
import winston from 'winston';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import operatorRoutes from './routes/operatorRoutes.js';


const app = express();
connectDB();
app.use(cookieParser());
app.use(express.json())


// Application Logger
const logger = winston.createLogger({
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

// Request Logger (Morgan)
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

app.get('/', (req, res) => {
  logger.info('Handling request for /');
  res.send('Hello World!');
});

app.use('/api/auth' ,authRoutes);
app.use('/api/operator' ,operatorRoutes);

app.listen(process.env.PORT, () => {
  logger.info('Server is running on port 5000');
});