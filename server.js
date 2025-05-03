import express from 'express';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import operatorRoutes from './routes/operatorRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { logger, requestLogger } from './services/loggingService.js';
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10000 
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
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://localhost:3000'],  
    credentials: true, 
  })
);

app.use(requestLogger)

app.use('/api/auth', authRoutes);
app.use('/api/operator', operatorRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, 'certs', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'certs', 'cert.pem'))
};

const httpPort = process.env.HTTP_PORT || 3080;
const httpServer = http.createServer((req, res) => {
  res.writeHead(301, { 
    "Location": "https://" + req.headers['host'].replace(httpPort.toString(), process.env.PORT) + req.url 
  });
  res.end();
});

const httpsServer = https.createServer(httpsOptions, app);

httpServer.listen(httpPort, () => {
  console.log(`HTTP server running on port ${httpPort} (redirecting to HTTPS)`);
  logger.info(`HTTP server running on port ${httpPort} (redirecting to HTTPS)`);
});

httpsServer.listen(process.env.PORT, () => {
  console.log(`HTTPS server running on port ${process.env.PORT}`);
  logger.info(`HTTPS server running on port ${process.env.PORT}`);
});