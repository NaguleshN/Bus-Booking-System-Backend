import userModel from "../models/userModel.js";
import tripModel from "../models/tripModel.js";
import bookingModel from "../models/bookingModel.js";

class UserService {
    getTrips = async() =>{
        const trips = await tripModel.find({ arrivalTime: { $gt: new Date() } });
        return trips;
    }

    getTrip = async(tripId) =>{
        const trip = await tripModel.findOne({ _id : tripId, arrivalTime: { $gt: new Date() } });
        return trip;
    }
    viewProfile = async(userId) =>{
        const profile = await userModel.findById(userId);
        return profile;
    }

    updateProfile = async(userId,update) =>{
        const { email , name , password } = update;
        const user = await userModel.findById(userId);
        if(email) user.email = email;
        if(name) user.name = name;
        if(password) user.password = password;
        await user.save();
        return user;
    }

    bookTickets = async(userId,tripId,seats,seatNumbers) =>{
        try{
            const user = await userModel.findById(userId);
            const trip = await tripModel.findById(tripId);
            if (!Array.isArray(seatNumbers)) {
                throw new Error('seatNumbers must be an array');
            }
            if (seats !== seatNumbers.length) {
                throw new Error('Seat count must match seat numbers provided');
            }
            if(trip.availableSeats < seats) throw new Error("Seats are not available");

            user.bookings.push({ tripId  });
            trip.availableSeats -= seats;

            await bookingModel.create(
            {
                userId,
                tripId,
                seatsBooked,
                seatNumbers,
                totalPrice : seats * trip.price,
                bookingStatus: 'Confirmed'
            });

            await trip.save();
            await user.save();
            return user;
        }catch(err){
            return res.status(500).json({message:err.message}); 
        }
        
    }
}

export default UserService ;