import express from 'express';
import OperatorController from '../controllers/OperatorController.js';

const router = express.Router();
const operatorController = new OperatorController()

router.post('/create_bus',operatorController.createBus);
router.post('/update_bus/:id',operatorController.updateBus);
router.post('/delete_bus/:id',operatorController.deleteBus);

router.post('/create_trip',operatorController.createTrip);
router.post('/update_trip/:id',operatorController.updateTrip);
router.post('/delete_trip/:id',operatorController.deleteTrip);

export default router;