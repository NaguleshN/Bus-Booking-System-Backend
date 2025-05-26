import express from 'express';
import UserController from '../controllers/UserController.js';
import AuthMiddleware from '../middleware/AuthMiddleware.js';
import OperatorController from '../controllers/OperatorController.js';


const router = express.Router();

const userController = new UserController();
const operatorController = new OperatorController();
const authMiddleware = new AuthMiddleware();

router.get('/trips',userController.getTrips);
router.get('/trips/:id',userController.getTrip);
router.get('/buses/:id', operatorController.getBus);

router.post('/bookings/:id', authMiddleware.protectUser, userController.bookTickets);
router.post('/bookings/:id/payment', userController.paymentForTickets);
router.get('/bookings', authMiddleware.protectUser, userController.getBookings);
router.get('/bookings/:id',userController.getBooking);
router.delete('/bookings/:id',userController.cancelBooking);
router.delete('/tickets/:id',userController.cancelTickets);

router.get('/profile/:id',userController.viewProfile);
router.patch('/profile/:id',userController.updateProfile);



export default router;