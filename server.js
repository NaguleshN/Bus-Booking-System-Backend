import express from 'express';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import operatorRoutes from './routes/operatorRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import loggingService from './services/loggingService.js';
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100 
});

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 1,
  delayMs: () => 2000,
});

const app = express();
app.use(limiter);
app.use(speedLimiter);

connectDB();
app.use(cookieParser());
app.use(express.json())

app.use(loggingService.morganLogging)

app.use('/api/auth', authRoutes);
app.use('/api/operator', operatorRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});