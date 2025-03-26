import express from 'express';
import OperatorController from '../controllers/OperatorController.js';
import AuthMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();
const operatorController = new OperatorController();
const authMiddleware = new AuthMiddleware();

router.get('/trips/:id',authMiddleware.protectOperator, operatorController.getMyTrips);

router.get('/buses',authMiddleware.protectOperator, operatorController.getBuses);
router.post('/buses',authMiddleware.protectOperator, operatorController.createBus);
router.patch('/buses/:id', authMiddleware.protectOperator, operatorController.updateBus);
router.delete('/buses/:id',authMiddleware.protectOperator, operatorController.deleteBus);

router.post('/trips',authMiddleware.protectOperator, operatorController.createTrip);
router.patch('/trips/:id',authMiddleware.protectOperator, operatorController.updateTrip);
router.delete('/trips/:id',authMiddleware.protectOperator, operatorController.deleteTrip);
router.patch('/trips/:id/cancel',authMiddleware.protectOperator, operatorController.cancelTrip);

export default router;