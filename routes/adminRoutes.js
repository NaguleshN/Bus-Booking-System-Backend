import express from 'express';
import AdminController from '../controllers/AdminController.js';

const router = express.Router();
const adminController = new AdminController(); 

router.get('/get_users', adminController.getUsers);
router.get('/get_operators', adminController.getOperators);
router.get('/get_trips', adminController.getAlltrips);
router.get('/block_unblock/:id', adminController.blockUnblock);

export default router;