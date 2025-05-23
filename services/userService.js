import userModel from "../models/userModel.js";
import tripModel from "../models/tripModel.js";
import bookingModel from "../models/bookingModel.js";
import paymentModel from "../models/paymentModel.js";
import feedbackModel from "../models/feedbackModel.js";

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

    bookTickets = async (userId, tripId, bookData) => {
        const { seats, seatNumbers } = bookData;

        const user = await userModel.findById(userId);
        const trip = await tripModel.findById(tripId);

        if (!Array.isArray(seatNumbers)) {
            throw new Error('seatNumbers must be an array');
        }

        if (seatNumbers.length === 0) {
            throw new Error('seatNumbers cannot be empty');
        }

        if (seats !== seatNumbers.length) {
            throw new Error('Seat count must match seat numbers provided');
        }

        if (trip.availableSeats < seats) {
            throw new Error("Seats are not available");
        }

        trip.seatNumbers = trip.seatNumbers || [];

        const allSeatsAvailable = seatNumbers.every(seat => trip.seatNumbers.includes(seat));
        // console.log('All seats available:', allSeatsAvailable);

        if (!allSeatsAvailable) {
            throw new Error('Some seat numbers are not available');
        }

        trip.seatNumbers = trip.seatNumbers.filter(seat => !seatNumbers.includes(seat));
        // console.log("Updated trip seat numbers:", trip.seatNumbers);

        trip.availableSeats -= seats;
        // console.log("Updated available seats:", trip.availableSeats);

        const booking = await bookingModel.create({
            userId,
            tripId,
            seatsBooked: seatNumbers,
            totalPrice: seats * trip.price,
            paymentStatus: 'Pending',
            bookingStatus: 'Confirmed',
        });
        await trip.save();
        user.bookings.push(booking._id);
        await user.save();

        return booking;
    };


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

    addReview = async(userId,tripId,reviewData) =>{
        const { rating, comment } = reviewData;
        const trip = await tripModel.findById(tripId);
        const user = await userModel.findById(userId);
        if(!user) throw new Error("User not found");
        
        if(!trip) throw new Error("Trip not found");
        const review = await feedbackModel.create({
            userId,
            tripId,
            rating,
            comment
        });
        trip.feedbacks.push(review._id);
        await trip.save();
        return trip;
    }
    getReviews = async(tripId) =>{
        const trip = await tripModel.findById(tripId);
        if(!trip) throw new Error("Trip not found");
        return trip.reviews;
    }
        
    paymentForTickets = async (userId, bookingId, paymentData) => {
        const booking = await bookingModel.findById(bookingId);
        if (!booking) throw new Error("Booking not found");
    
        if (!booking.userId || !userId || booking.userId.toString() !== userId.toString()) {
            throw new Error("You are not authorized to make payment for this booking");
        }
    
        const trip = await tripModel.findById(booking.tripId);
        if (!trip) throw new Error("Trip not found");
    
        const payment = await paymentModel.create({
            bookingId,
            userId,
            amount: paymentData.amount,
            paymentMethod: paymentData.paymentMethod,
            transactionId: paymentData.transactionId,
            paymentStatus: paymentData.paymentStatus
        });
    
        if (paymentData.paymentStatus === 'Success') {
            booking.paymentStatus = 'Paid';
            booking.seatNumbers = paymentData.seatNumbers;
            await booking.save();
    
            trip.availableSeats = trip.availableSeats.filter(
                seat => !paymentData.seatNumbers.includes(seat)
            );
            await trip.save();
    
            payment.paymentStatus = 'Paid';
            await payment.save();
        }
    
        return payment;
    };
    

}

export default UserService ;