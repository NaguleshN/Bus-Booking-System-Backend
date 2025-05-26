import UserService from '../../services/userService.js';
import userModel from '../../models/userModel.js'; 
import tripModel from '../../models/tripModel.js';
import bookingModel from '../../models/bookingModel.js';
import paymentModel from '../../models/paymentModel.js';
import feedbackModel from '../../models/feedbackModel.js';

jest.mock('../../models/userModel.js');
jest.mock('../../models/tripModel.js');
jest.mock('../../models/bookingModel.js');
jest.mock('../../models/paymentModel.js');
jest.mock('../../models/feedbackModel.js');

const userService = new UserService();

const mockUserId = 'user123';
const mockTripId = 'trip123';
const mockBookingId = 'booking123';

describe('UserService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('getTrips should return future trips', async () => {
    const trips = [{ _id: mockTripId }];
    tripModel.find.mockResolvedValue(trips);
    const result = await userService.getTrips();
    expect(result).toEqual(trips);
  });

  test('getTrip should return a future trip by id', async () => {
    const trip = { _id: mockTripId };
    tripModel.findOne.mockResolvedValue(trip);
    const result = await userService.getTrip(mockTripId);
    expect(result).toEqual(trip);
  });

  test('viewProfile should return user profile', async () => {
    const profile = { _id: mockUserId };
    userModel.findById.mockResolvedValue(profile);
    const result = await userService.viewProfile(mockUserId);
    expect(result).toEqual(profile);
  });

  test('updateProfile should update fields conditionally', async () => {
    const user = { save: jest.fn(), email: '', name: '', password: '' };
    userModel.findById.mockResolvedValue(user);
    const updated = await userService.updateProfile(mockUserId, {
      email: 'new@mail.com', name: 'NewName'
    });
    expect(user.email).toBe('new@mail.com');
    expect(user.name).toBe('NewName');
    expect(user.save).toHaveBeenCalled();
    expect(updated).toEqual(user);
  });

  test('updateProfile should update when email is given', async () => {
    const user = { save: jest.fn(), email: '', name: '', password: '' };
    userModel.findById.mockResolvedValue(user);
    const updated = await userService.updateProfile(mockUserId, {
      email: 'new1@mail.com'
    });
    expect(user.email).toBe('new1@mail.com');
    expect(user.save).toHaveBeenCalled();
    expect(updated).toEqual(user);
  });

  test('updateProfile should update when name is given', async () => {
    const user = { save: jest.fn(), email: '', name: '', password: '' };
    userModel.findById.mockResolvedValue(user);
    const updated = await userService.updateProfile(mockUserId, {
      name: 'new1@mail.com'
    });
    expect(user.name).toBe('new1@mail.com');
    expect(user.save).toHaveBeenCalled();
    expect(updated).toEqual(user);
  });

  test('updateProfile should update when pass is given', async () => {
    const user = { save: jest.fn(), email: '', name: '', password: '' };
    userModel.findById.mockResolvedValue(user);
    const updated = await userService.updateProfile(mockUserId, {
      password: 'new1@mail.com'
    });
    expect(user.password).toBe('new1@mail.com');
    expect(user.save).toHaveBeenCalled();
    expect(updated).toEqual(user);
  });


//   test('bookTickets should throw error for invalid seatNumbers type', async () => {
//     await expect(userService.bookTickets(mockUserId, mockTripId, { seats: 2, seatNumbers: 'A1' }))
//       .rejects.toThrow('seatNumbers must be an array');
//   });

//   test('bookTickets should throw if seat count mismatch', async () => {
//     await expect(userService.bookTickets(mockUserId, mockTripId, { seats: 2, seatNumbers: ['A1'] }))
//       .rejects.toThrow('Seat count must match seat numbers provided');
//   });

//   test('bookTickets should throw if seats not available', async () => {
//     tripModel.findById.mockResolvedValue({ availableSeats: 1 });
//     await expect(userService.bookTickets(mockUserId, mockTripId, { seats: 2, seatNumbers: ['A1', 'A2'] }))
//       .rejects.toThrow("Seats are not available");
//   });

//   test('cancelBooking should throw if booking not found', async () => {
//     bookingModel.findById.mockResolvedValue(null);
//     await expect(userService.cancelBooking(mockBookingId)).rejects.toThrow("Booking not found");
//   });

//   test('cancelBooking should throw if booking already cancelled', async () => {
//     bookingModel.findById.mockResolvedValue({ bookingStatus: 'Cancelled' });
//     await expect(userService.cancelBooking(mockBookingId)).rejects.toThrow("Booking already cancelled");
//   });

//   test('cancelBooking should throw if payment already made', async () => {
//     bookingModel.findById.mockResolvedValue({ bookingStatus: 'Confirmed', paymentStatus: 'Paid' });
//     await expect(userService.cancelBooking(mockBookingId)).rejects.toThrow("Booking already paid");
//   });

//   test('addReview should throw if user not found', async () => {
//     userModel.findById.mockResolvedValue(null);
//     await expect(userService.addReview(mockUserId, mockTripId, {})).rejects.toThrow("User not found");
//   });

//   test('addReview should add review to trip', async () => {
//     const mockTrip = { feedbacks: [], save: jest.fn() };
//     const mockUser = {};
//     tripModel.findById.mockResolvedValue(mockTrip);
//     userModel.findById.mockResolvedValue(mockUser);
//     const mockReview = { _id: 'review123' };
//     feedbackModel.create.mockResolvedValue(mockReview);

//     const result = await userService.addReview(mockUserId, mockTripId, { rating: 5, comment: 'Nice' });
//     expect(mockTrip.feedbacks).toContain('review123');
//     expect(result).toEqual(mockTrip);
//   });

//   test('addReviews should return error for invalid trip', async () => {
//     const mockTrip = { feedbacks: [], save: jest.fn() };
//     const mockUser = {};
//     userModel.findById.mockResolvedValue(mockUser);
//     const mockReview = { _id: 'review123' };
//     feedbackModel.create.mockResolvedValue(mockReview);
//     const mockTripId = 'invalidTripId';
//     tripModel.findById.mockResolvedValue(null);
//     await expect(userService.addReview(mockUserId,mockTripId, { rating: 5, comment: 'Nice' })).rejects.toThrow("Trip not found");
    
//   });

//   test('getReviews should return trip reviews', async () => {
//     const trip = { reviews: ['review1', 'review2'] };
//     tripModel.findById.mockResolvedValue(trip);
//     const result = await userService.getReviews(mockTripId);
//     expect(result).toEqual(trip.reviews);
//   });

//   test('getReviews should return error for invalid trip', async () => {
//     const invalidTripId = 'invalidTripId';
//     tripModel.findById.mockResolvedValue(null);
//     await expect(userService.getReviews(invalidTripId)).rejects.toThrow("Trip not found");
    
//   });

//   test('paymentForTickets should throw if booking not found', async () => {
//     bookingModel.findById.mockResolvedValue(null);
//     await expect(userService.paymentForTickets(mockUserId, mockBookingId, {})).rejects.toThrow("Booking not found");
//   });

//   test('paymentForTickets should throw if unauthorized user', async () => {
//     bookingModel.findById.mockResolvedValue({ userId: 'someoneElse', tripId: mockTripId });
//     await expect(userService.paymentForTickets(mockUserId, mockBookingId, {})).rejects.toThrow("You are not authorized to make payment for this booking");
//   });

//   test('should throw error if trip not found', async () => {
//     const booking = { userId: mockUserId, tripId: mockTripId };
//     bookingModel.findById.mockResolvedValue(booking);
//     tripModel.findById.mockResolvedValue(null); // No trip found
//     await expect(userService.paymentForTickets(mockUserId, mockBookingId, {}))
//       .rejects
//       .toThrow('Trip not found');
//   });

//   test('should process payment and update booking and trip when payment status is Success', async () => {
//     const booking = { userId: mockUserId, tripId: mockTripId, save: jest.fn() };
//     const trip = { availableSeats: ['A1', 'A2', 'A3'], save: jest.fn() };
//     bookingModel.findById.mockResolvedValue(booking);
//     tripModel.findById.mockResolvedValue(trip);

//     const paymentData = {
//       amount: 200,
//       paymentMethod: 'UPI',
//       transactionId: 'txn123',
//       paymentStatus: 'Success',
//       seatNumbers: ['A1', 'A2']
//     };

//     const payment = { paymentStatus: 'Paid', save: jest.fn() };
//     paymentModel.create.mockResolvedValue(payment);

//     const result = await userService.paymentForTickets(mockUserId, mockBookingId, paymentData);

//     expect(result.paymentStatus).toBe('Paid');
//     expect(booking.paymentStatus).toBe('Paid');
//     expect(booking.seatNumbers).toEqual(['A1', 'A2']);
//     expect(booking.save).toHaveBeenCalled();
//     expect(trip.availableSeats).toEqual(['A3']);
//     expect(trip.save).toHaveBeenCalled();
//     expect(payment.save).toHaveBeenCalled();
//   });
  
//   test('should throw error if payment status is not "Success"', async () => {
//     const booking = { userId: mockUserId, tripId: mockTripId };
//     const trip = { availableSeats: ['A1', 'A2'], save: jest.fn() };
//     bookingModel.findById.mockResolvedValue(booking);
//     tripModel.findById.mockResolvedValue(trip);

//     const paymentData = {
//         amount: 200,
//         paymentMethod: 'UPI',
//         transactionId: 'txn123',
//         paymentStatus: 'Failed', // Failed payment
//         seatNumbers: ['A1', 'A2']
//     };

//     const payment = { paymentStatus: 'Failed', save: jest.fn() };
//     paymentModel.create.mockResolvedValue(payment);

//     const result = await userService.paymentForTickets(mockUserId, mockBookingId, paymentData);
//     expect(payment.save).not.toHaveBeenCalled();
//     expect(result.paymentStatus).toBe('Failed');
// });

// test('bookTickets should throw error if seatNumbers is an empty array', async () => {
//   await expect(userService.bookTickets(mockUserId, mockTripId, { seats: 0, seatNumbers: [] }))
//       .rejects
//       .toThrow('seatNumbers cannot be empty');
// });

// test('getBookings should return bookings for a specific user', async () => {
//   const mockUserId = '12345';
//   const mockBookings = [
//     { _id: '1', userId: mockUserId, event: 'Event 1' },
//     { _id: '2', userId: mockUserId, event: 'Event 2' }
//   ];
  
//   bookingModel.find.mockResolvedValue(mockBookings);
  
//   const result = await userService.getBookings(mockUserId);
  
//   expect(bookingModel.find).toHaveBeenCalledWith({ userId: mockUserId });
//   expect(result).toEqual(mockBookings);
// });

// test('getBookings should return empty array if no bookings found', async () => {
//   const mockUserId = '12345';
//   bookingModel.find.mockResolvedValue([]);
  
//   const result = await userService.getBookings(mockUserId);
  
//   expect(result).toEqual([]);
// });

// test('getBooking should return a specific booking by ID', async () => {
//   const mockBookingId = '1';
//   const mockBooking = { _id: mockBookingId, userId: '123', event: 'Event 1' };
  
//   bookingModel.findById.mockResolvedValue(mockBooking);
  
//   const result = await userService.getBooking(mockBookingId);
  
//   expect(bookingModel.findById).toHaveBeenCalledWith(mockBookingId);
//   expect(result).toEqual(mockBooking);
// });

// test('getBooking should return null if booking not found', async () => {
//   const mockBookingId = 'nonexistent';
//   bookingModel.findById.mockResolvedValue(null);
  
//   const result = await userService.getBooking(mockBookingId);
  
//   expect(result).toBeNull();
// });

// test('bookTickets should throw error if seatNumbers is not an array', async () => {
//   const mockData = { seats: 2, seatNumbers: '1A,1B' };
  
//   await expect(userService.bookTickets('userId', 'tripId', mockData))
//     .rejects
//     .toThrow('seatNumbers must be an array');
// });

// test('bookTickets should throw error if seatNumbers is empty', async () => {
//   const mockData = { seats: 0, seatNumbers: [] };
  
//   await expect(userService.bookTickets('userId', 'tripId', mockData))
//     .rejects
//     .toThrow('seatNumbers cannot be empty');
// });

// test('bookTickets should throw error if seats count mismatch', async () => {
//   const mockData = { seats: 2, seatNumbers: ['1A'] };
  
//   await expect(userService.bookTickets('userId', 'tripId', mockData))
//     .rejects
//     .toThrow('Seat count must match seat numbers provided');
// });

// test('bookTickets should throw error if not enough available seats', async () => {
//   const mockData = { seats: 3, seatNumbers: ['1A', '1B', '1C'] };
//   const mockTrip = { 
//     _id: 'tripId', 
//     availableSeats: 2,
//     seatNumbers: ['1A', '1B', '1C'],
//     price: 100,
//     save: jest.fn() 
//   };
  
//   tripModel.findById.mockResolvedValue(mockTrip);
  
//   await expect(userService.bookTickets('userId', 'tripId', mockData))
//     .rejects
//     .toThrow('Seats are not available');
// });

// test('bookTickets should throw error if seats not available', async () => {
//   const mockData = { seats: 2, seatNumbers: ['1A', '1B'] };
//   const mockTrip = { 
//     _id: 'tripId', 
//     availableSeats: 5,
//     seatNumbers: ['1C', '1D'], // 1A and 1B not available
//     price: 100,
//     save: jest.fn() 
//   };
  
//   tripModel.findById.mockResolvedValue(mockTrip);
  
//   await expect(userService.bookTickets('userId', 'tripId', mockData))
//     .rejects
//     .toThrow('Some seat numbers are not available');
// });

// test('bookTickets should create booking when all conditions are met', async () => {
//   const mockData = { seats: 2, seatNumbers: ['1A', '1B'] };
//   const mockUser = { 
//     _id: 'userId',
//     bookings: [],
//     save: jest.fn()
//   };
//   const mockTrip = { 
//     _id: 'tripId', 
//     availableSeats: 5,
//     seatNumbers: ['1A', '1B', '1C'],
//     price: 100,
//     save: jest.fn() 
//   };
//   const mockBooking = {
//     _id: 'bookingId',
//     seatsBooked: ['1A', '1B'],
//     totalPrice: 200
//   };

//   userModel.findById.mockResolvedValue(mockUser);
//   tripModel.findById.mockResolvedValue(mockTrip);
//   bookingModel.create.mockResolvedValue(mockBooking);

//   const result = await userService.bookTickets('userId', 'tripId', mockData);

//   expect(mockTrip.seatNumbers).toEqual(['1C']);
//   expect(mockTrip.availableSeats).toBe(3);
//   expect(mockTrip.save).toHaveBeenCalled();

//   expect(mockUser.bookings).toContain('bookingId');
//   expect(mockUser.save).toHaveBeenCalled();

//   expect(bookingModel.create).toHaveBeenCalledWith({
//     userId: 'userId',
//     tripId: 'tripId',
//     seatsBooked: ['1A', '1B'],
//     totalPrice: 200,
//     paymentStatus: 'Pending',
//     bookingStatus: 'Confirmed'
//   });

//   expect(result).toEqual(mockBooking);
// });


// test('bookTickets should handle empty seatNumbers array in trip', async () => {
//   const mockData = { seats: 1, seatNumbers: ['1A'] };
//   const mockTrip = { 
//     _id: 'tripId', 
//     availableSeats: 5,
//     seatNumbers: undefined, // testing undefined case
//     price: 100,
//     save: jest.fn() 
//   };

//   tripModel.findById.mockResolvedValue(mockTrip);
  
//   await expect(userService.bookTickets('userId', 'tripId', mockData))
//     .rejects
//     .toThrow('Some seat numbers are not available');
// });

// test('bookTickets should throw error if user not found', async () => {
//   const mockData = { seats: 1, seatNumbers: ['1A'] };
//   userModel.findById.mockResolvedValue(null);
  
//   await expect(userService.bookTickets('userId', 'tripId', mockData))
//     .rejects
//     .toThrow('Some seat numbers are not available');
// });

// test('cancelBooking should throw error if booking not found', async () => {
//   bookingModel.findById.mockResolvedValue(null);
  
//   await expect(userService.cancelBooking('invalidId'))
//     .rejects
//     .toThrow('Booking not found');
// });

// test('cancelBooking should throw error if trip not found', async () => {
//   const mockBooking = { 
//     _id: 'bookingId',
//     tripId: 'tripId',
//     bookingStatus: 'Confirmed',
//     paymentStatus: 'Pending',
//     seatsBooked: ['1A', '1B']
//   };
  
//   bookingModel.findById.mockResolvedValue(mockBooking);
//   tripModel.findById.mockResolvedValue(null);
  
//   await expect(userService.cancelBooking('bookingId'))
//     .rejects
//     .toThrow('Trip not found');
// });

// test('should throw error if booking already cancelled', async () => {
//   const mockBooking = { 
//     _id: mockBookingId,
//     tripId: mockTripId,
//     bookingStatus: 'Cancelled',
//     paymentStatus: 'Pending'
//   };
  
//   const mockTrip = {
//     _id: mockTripId,
//     seatNumbers: [],
//     availableSeats: 10
//   };
  
//   bookingModel.findById.mockResolvedValue(mockBooking);
//   tripModel.findById.mockResolvedValue(mockTrip);
  
//   await expect(userService.cancelBooking(mockBookingId))
//     .rejects
//     .toThrow('Booking already cancelled');
// });

// test('cancelBooking should throw error if booking already paid', async () => {
//   const mockBooking = { 
//     _id: 'bookingId',
//     tripId: 'tripId',
//     bookingStatus: 'Confirmed',
//     paymentStatus: 'Paid'
//   };
  
//   bookingModel.findById.mockResolvedValue(mockBooking);
  
//   await expect(userService.cancelBooking('bookingId'))
//     .rejects
//     .toThrow('Booking already paid');
// });

// test('should restore booked seats to trip.seatNumbers', async () => {
//   const mockBooking = {
//     _id: 'booking1',
//     tripId: 'trip1',
//     bookingStatus: 'Confirmed',
//     paymentStatus: 'Pending',
//     seatsBooked: ['1A', '1B'],
//     save: jest.fn()
//   };

//   const mockTrip = {
//     _id: 'trip1',
//     seatNumbers: ['2A', '2B'],
//     availableSeats: 8,
//     save: jest.fn()
//   };

//   bookingModel.findById.mockResolvedValue(mockBooking);
//   tripModel.findById.mockResolvedValue(mockTrip);

//   await userService.cancelBooking('booking1');

//   expect(mockTrip.seatNumbers).toEqual(['2A', '2B', '1A', '1B']);
// });




});



