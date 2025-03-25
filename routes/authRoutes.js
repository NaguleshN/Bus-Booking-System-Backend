import express from 'express';
import AuthController from '../controllers/authController.js';

const router = express.Router();
const authController = new AuthController();

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/logout', authController.logout);

export default router;