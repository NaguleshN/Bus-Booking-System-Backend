import userModel from "../models/userModel.js";
import tripModel from "../models/tripModel.js";
import bookingModel from "../models/bookingModel.js";
import paymentModel from "../models/paymentModel.js";
import feedbackModel from "../models/feedbackModel.js";
import mongoose from 'mongoose';

class UserService {
    getTrips = async(filters) =>{

        let query = {};

        if (filters.from) query.source = { $regex: new RegExp(filters.from, 'i') }; 
        if (filters.to) query.destination = { $regex: new RegExp(filters.to, 'i') };
    
        if (filters.date) {
            const start = new Date(filters.date);
            start.setHours(0, 0, 0, 0);
            const end = new Date(filters.date);
            end.setHours(23, 59, 59, 999);
            query.departureTime = { $gte: start, $lte: end };
        }
    
        if (filters.minPrice || filters.maxPrice) {
            query.price = {};
            if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
            if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
        }
    
        const trips = await tripModel.find(query)
            .populate('operatorId', 'name email') 
            .populate('busId', 'name busNumber') 
    
        return trips;

        // const trips = await tripModel.find({ arrivalTime: { $gt: new Date() } });
        // return trips;
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

    // bookTickets = async (userId, tripId, bookData) => {
    //     const { seats, seatNumbers } = bookData;

    //     const user = await userModel.findById(userId);
    //     const trip = await tripModel.findById(tripId);

    //     if (!Array.isArray(seatNumbers)) {
    //         throw new Error('seatNumbers must be an array');
    //     }

    //     if (seatNumbers.length === 0) {
    //         throw new Error('seatNumbers cannot be empty');
    //     }

    //     if (seats !== seatNumbers.length) {
    //         throw new Error('Seat count must match seat numbers provided');
    //     }

    //     if (trip.availableSeats < seats) {
    //         throw new Error("Seats are not available");
    //     }

    //     trip.seatNumbers = trip.seatNumbers || [];

    //     const allSeatsAvailable = seatNumbers.every(seat => trip.seatNumbers.includes(seat));
    //     // console.log('All seats available:', allSeatsAvailable);

    //     if (!allSeatsAvailable) {
    //         throw new Error('Some seat numbers are not available');
    //     }

    //     trip.seatNumbers = trip.seatNumbers.filter(seat => !seatNumbers.includes(seat));
    //     // console.log("Updated trip seat numbers:", trip.seatNumbers);

    //     trip.availableSeats -= seats;
    //     // console.log("Updated available seats:", trip.availableSeats);

    //     const booking = await bookingModel.create({
    //         userId,
    //         tripId,
    //         seatsBooked: seatNumbers,
    //         totalPrice: seats * trip.price,
    //         paymentStatus: 'Pending',
    //         bookingStatus: 'Confirmed',
    //     });
    //     await trip.save();
    //     user.bookings.push(booking._id);
    //     await user.save();

    //     return booking;
    // };

    bookTickets = async (userId, tripId, bookData) => {
        const MAX_RETRIES = 5;
        let retryCount = 0;
        let lastError = null;
      
        while (retryCount < MAX_RETRIES) {
          const session = await mongoose.startSession();
      
          try {
            session.startTransaction();
      
            const { seats, seatNumbers } = bookData;
      
            if (!Array.isArray(seatNumbers)) {
              throw new Error('seatNumbers must be an array');
            }
      
            if (seatNumbers.length === 0) {
              throw new Error('seatNumbers cannot be empty');
            }
      
            if (seats !== seatNumbers.length) {
              throw new Error('Seat count must match seat numbers provided');
            }
      
            const user = await userModel.findOne({ _id: userId }).session(session);
            
            const trip = await tripModel.findById(tripId).session(session);
      
            if (!trip) {
              throw new Error('Trip not found');
            }
      
            if (trip.availableSeats < seats) {
              throw new Error('Seats are not available');
            }
      
            trip.seatNumbers = trip.seatNumbers || [];
      
            const unavailableSeats = seatNumbers.filter(seat => !trip.seatNumbers.includes(seat));
            if (unavailableSeats.length > 0) {
              throw new Error(`Some seat numbers are not available: ${unavailableSeats.join(', ')}`);
            }
      
            trip.seatNumbers = trip.seatNumbers.filter(seat => !seatNumbers.includes(seat));
            trip.availableSeats -= seats;
      
            const booking = await bookingModel.create([{
              userId,
              tripId,
              seatsBooked: seatNumbers,
              totalPrice: seats * trip.price,
              paymentStatus: 'Pending',
              bookingStatus: 'Confirmed',
            }], { session });
      
            await trip.save({ session });
      
            if (user) {
              user.bookings = user.bookings || [];
              user.bookings.push(booking[0]._id);
              await user.save({ session });
            }
      
            await session.commitTransaction();
            session.endSession();
      
            return booking[0];
      
          } catch (err) {
            await session.abortTransaction();
            session.endSession();
            
            if (
              err.message && (
                err.message.includes('WriteConflict') ||
                err.message.includes('Write conflict') ||
                err.message.includes('TransientTransactionError')
              )
            ) {
              retryCount++;
              lastError = err;
              
              const backoffTime = Math.floor(Math.random() * (100 * Math.pow(2, retryCount)));
              console.log(`Retrying transaction (${retryCount}/${MAX_RETRIES}) after ${backoffTime}ms due to write conflict`);
              
              await new Promise(resolve => setTimeout(resolve, backoffTime));
            } else {
              throw err;
            }
          }
        }
        
        throw new Error(`Failed after ${MAX_RETRIES} retries. Last error: ${lastError.message}`);
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