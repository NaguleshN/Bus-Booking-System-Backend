import express from 'express';
import { Login, Register, Logout } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', Register);
router.post('/login', Login);
router.post('/logout', Logout);


export default router;