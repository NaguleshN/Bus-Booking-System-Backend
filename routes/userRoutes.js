import express from 'express';
import UserController from '../controllers/UserController.js'


const router = express.Router();

const userController = new UserController();

router.get('/trips',userController.getTrips);
router.get('/trips/:id',userController.getTrip);

router.get('/profile/:id',userController.viewProfile);
router.patch('/profile/:id',userController.updateProfile);



export default router;