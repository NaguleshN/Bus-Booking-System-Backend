import express from 'express';
import AuthController from '../controllers/authController.js';

const router = express.Router();
const authController = new AuthController();

// Register route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

// Logout route
router.post('/logout', authController.logout);

export default router;