import express from 'express';
import AdminController from '../controllers/AdminController.js';
import AuthMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();
const adminController = new AdminController(); 
const authMiddleware = new  AuthMiddleware();


router.get('/get_users', authMiddleware.protectAdmin ,adminController.getUsers);
router.get('/get_user/:id', authMiddleware.protectAdmin ,adminController.getUser);

router.get('/get_operators', authMiddleware.protectAdmin, adminController.getOperators);
router.get('/get_operator/:id', authMiddleware.protectAdmin, adminController.getOperator);
router.patch('/block_unblock/:id',authMiddleware.protectAdmin, adminController.blockUnblock);
router.patch('/approve_operator/:id',authMiddleware.protectAdmin, adminController.approveOperator);

router.get('/get_trips',authMiddleware.protectAdmin, adminController.getAllTrips);
router.get('/get_trip/:id',authMiddleware.protectAdmin, adminController.getTrip);
// router.patch('/get_trip/:id',authMiddleware.protectAdmin, adminController.getTrip);


export default router;