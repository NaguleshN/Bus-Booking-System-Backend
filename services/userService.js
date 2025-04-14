import userModel from "../models/userModel.js";
import tripModel from "../models/tripModel.js";
import bookingModel from "../models/bookingModel.js";
import paymentModel from "../models/paymentModel.js";

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

    bookTickets = async(userId,tripId,bookData) =>{
        const {seats,seatNumbers} = bookData;
        const user = await userModel.findById(userId);
        const trip = await tripModel.findById(tripId);
        if (!Array.isArray(seatNumbers)) {
            throw new Error('seatNumbers must be an array');
        }
        if (seats !== seatNumbers.length) {
            throw new Error('Seat count must match seat numbers provided');
        }
        if(trip.availableSeats < seats) throw new Error("Seats are not available");
        
        const allSeatsAvailable = seatNumbers.every(seat => trip.seatNumbers.includes(seat));
        console.log(allSeatsAvailable); 
        
        if (!allSeatsAvailable) {
            throw new Error('Some seat numbers are not available');
        }
        
        trip.seatNumbers = trip.seatNumbers.filter(seat => !seatNumbers.includes(seat));
        console.log("Trip id",tripId);
        
        trip.availableSeats -= seats;
        console.log(trip.availableSeats, trip.seatNumbers.length);
        
        const booking = await bookingModel.create(
        {
            userId,
            tripId,
            seatsBooked : seatNumbers,
            totalPrice : seats * trip.price,
            paymentStatus : 'Pending',
            bookingStatus: 'Confirmed'
        });
        
        await trip.save();
        user.bookings.push( booking._id );
        await user.save();
        return booking;
        
    }

    getBookings = async(userId) =>{
        const bookings = await bookingModel.find({ userId });
        return bookings;
    }

    getBooking = async(bookingId) =>{
        const booking = await bookingModel.findById(bookingId);
        return booking;
    }

    cancelBooking = async(bookingId) =>{
        const booking = await bookingModel.findById(bookingId);
        if(!booking) throw new Error("Booking not found");
        const trip = await tripModel.findById(booking.tripId);
        if(!trip) throw new Error("Trip not found");
        if(booking.bookingStatus === 'Cancelled') throw new Error("Booking already cancelled");
        if(booking.paymentStatus === 'Paid') throw new Error("Booking already paid");
        trip.seatNumbers = trip.seatNumbers.concat(booking.seatsBooked);
        trip.availableSeats += booking.seatsBooked.length;
        await trip.save();
        booking.bookingStatus = 'Cancelled';
        await booking.save();
        return booking;
    }
        
    paymentForTickets = async(userId, bookingId, paymentData) =>{ 
        const { seatNumbers, paymentStatus, transactionId, paymentMethod, amount } = paymentData;
        const booking = await bookingModel.findById(bookingId);
        if(!booking) throw new Error("Booking not found");
        if(booking.userId != userId) throw new Error("You are not authorized to make payment for this booking");
        const trip = await tripModel.findById(booking.tripId);
        booking.paymentStatus = paymentStatus;

        const payment = await paymentModel.create({
            bookingId,
            userId,
            amount,
            paymentMethod,
            transactionId,
            paymentStatus: 'Pending'
        });
        payment.paymentStatus = paymentStatus;
        if(paymentStatus === 'Success'){
            booking.paymentStatus = 'Paid';
            trip.availableSeats = trip.availableSeats.filter(seat => !seatNumbers.includes(seat));
            trip.availableSeats -= seatNumbers.length ;
            await trip.save();
        }
        await booking.save();
        return payment;
    }

}

export default UserService ;