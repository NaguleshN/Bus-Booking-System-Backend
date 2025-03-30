import express from 'express';
import OperatorController from '../controllers/OperatorController.js';
import AuthMiddleware from '../middleware/AuthMiddleware.js';

const router = express.Router();
const operatorController = new OperatorController();
const authMiddleware = new AuthMiddleware();


router.get('/buses',authMiddleware.protectOperator, operatorController.getBuses);
router.get('/buses/:id',authMiddleware.protectOperator, operatorController.getBus);
router.post('/buses',authMiddleware.protectOperator, operatorController.createBus);
router.patch('/buses/:id', authMiddleware.protectOperator, operatorController.updateBus);
router.delete('/buses/:id',authMiddleware.protectOperator, operatorController.deleteBus);

router.post('/trips',authMiddleware.protectOperator, operatorController.createTrip);
router.get('/trips/all',authMiddleware.protectOperator, operatorController.getMyTrips);
router.get('/trips/:id',authMiddleware.protectOperator, operatorController.getTrip);
router.patch('/trips/:id',authMiddleware.protectOperator, operatorController.updateTrip);
router.delete('/trips/:id',authMiddleware.protectOperator, operatorController.deleteTrip);
router.patch('/trips/:id/cancel',authMiddleware.protectOperator, operatorController.cancelTrip);

export default router;