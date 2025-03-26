import express from 'express';
import AdminController from '../controllers/AdminController.js';
import AuthMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();
const adminController = new AdminController(); 
const authMiddleware = new  AuthMiddleware();


router.get('/users', authMiddleware.protectAdmin ,adminController.getUsers);
router.get('/users/:id', authMiddleware.protectAdmin ,adminController.getUser);

router.get('/operators', authMiddleware.protectAdmin, adminController.getOperators);
router.get('/operators/:id', authMiddleware.protectAdmin, adminController.getOperator);
router.patch('/block_unblock/:id',authMiddleware.protectAdmin, adminController.blockUnblock);
router.patch('/operator/:id/approve',authMiddleware.protectAdmin, adminController.approveOperator);

router.get('/trips',authMiddleware.protectAdmin, adminController.getAllTrips);
router.get('/trips/:id',authMiddleware.protectAdmin, adminController.getTrip);
router.patch('/trips/:id',authMiddleware.protectAdmin, adminController.updateTrip);
router.patch('/trips/:id/cancel',authMiddleware.protectAdmin, adminController.cancelTrip);


export default router;