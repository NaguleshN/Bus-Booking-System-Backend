import express from 'express';
import OperatorController from '../controllers/OperatorController.js';
import AuthMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();
const operatorController = new OperatorController();
const authMiddleware = new AuthMiddleware();

router.get('/get_trips/:id',authMiddleware.protectOperator, operatorController.getMyTrips);

router.post('/create_bus',authMiddleware.protectOperator, operatorController.createBus);
router.patch('/update_bus/:id', authMiddleware.protectOperator, operatorController.updateBus);
router.delete('/delete_bus/:id',authMiddleware.protectOperator, operatorController.deleteBus);

router.post('/create_trip',authMiddleware.protectOperator, operatorController.createTrip);
router.patch('/update_trip/:id',authMiddleware.protectOperator, operatorController.updateTrip);
router.delete('/delete_trip/:id',authMiddleware.protectOperator, operatorController.deleteTrip);

export default router;