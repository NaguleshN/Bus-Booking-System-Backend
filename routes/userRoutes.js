import express from 'express';
import UserController from '../controllers/UserController.js';
import AuthMiddleware from '../middleware/AuthMiddleware.js';


const router = express.Router();

const userController = new UserController();
const authMiddleware = new AuthMiddleware();

router.get('/trips',userController.getTrips);
router.get('/trips/:id',userController.getTrip);

router.post('/bookings/:id', authMiddleware.protectUser, userController.bookTickets);
router.post('/bookings/:id/payment', userController.paymentForTickets);
router.get('/bookings', authMiddleware.protectUser, userController.getBookings);
router.get('/bookings/:id',userController.getBooking);
router.delete('/bookings/:id',userController.cancelBooking);

router.get('/profile/:id',userController.viewProfile);
router.patch('/profile/:id',userController.updateProfile);



export default router;