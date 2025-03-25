import express from 'express';
import OperatorController from '../controllers/OperatorController.js';
import AuthMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();
const operatorController = new OperatorController();
// const AuthController = new AuthCo
const authMiddleware = new AuthMiddleware();

router.get('/get_trips/:id',authMiddleware.protectOperator, operatorController.getMyTrips);

router.post('/create_bus',authMiddleware.protectOperator, operatorController.createBus);
router.post('/update_bus/:id', authMiddleware.protectOperator, operatorController.updateBus);
router.post('/delete_bus/:id',authMiddleware.protectOperator, operatorController.deleteBus);

router.post('/create_trip',authMiddleware.protectOperator, operatorController.createTrip);
router.post('/update_trip/:id',authMiddleware.protectOperator, operatorController.updateTrip);
router.post('/delete_trip/:id',authMiddleware.protectOperator, operatorController.deleteTrip);

export default router;