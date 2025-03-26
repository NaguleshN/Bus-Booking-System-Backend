import express from 'express';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import operatorRoutes from './routes/operatorRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import loggingService from './services/loggingService.js';


const app = express();
connectDB();
app.use(cookieParser());
app.use(express.json())

app.use(loggingService.morganLogging)

app.use('/api/auth', authRoutes);
app.use('/api/operator', operatorRoutes);
app.use('/api/admin', adminRoutes);

app.listen(process.env.PORT, () => {
  console.log('Server is running on port 5000');
});