import UserService from '../../services/userService.js';
import userModel from '../../models/userModel.js'; 
import tripModel from '../../models/tripModel.js';
import bookingModel from '../../models/bookingModel.js';

jest.mock('../../models/userModel.js');
jest.mock('../../models/busModel.js');
jest.mock('../../models/tripModel.js');
jest.mock('../../models/bookingModel.js');
jest.mock('../../models/paymentModel.js');


describe('UserService', () => {
  let userService;
  const mockUserId = 'user123';
  const mockTripId = 'trip123';
  const mockBookingId = 'booking123';
  const mockPaymentId = 'payment123';

  beforeEach(() => {
    userService = new UserService();
    jest.clearAllMocks();
  });

  describe('Trip Operations', () => {
    test('getTrips should return upcoming trips', async () => {
      const mockTrips = [{ _id: 'trip1' }, { _id: 'trip2' }];
      tripModel.find.mockResolvedValue(mockTrips);

      const result = await userService.getTrips();
      expect(tripModel.find).toHaveBeenCalledWith({ arrivalTime: { $gt: expect.any(Date) } });
      expect(result).toEqual(mockTrips);
    });

    test('getTrip should return a specific upcoming trip', async () => {
      const mockTrip = { _id: mockTripId };
      tripModel.findOne.mockResolvedValue(mockTrip);

      const result = await userService.getTrip(mockTripId);
      expect(tripModel.findOne).toHaveBeenCalledWith({
        _id: mockTripId,
        arrivalTime: { $gt: expect.any(Date) }
      });
      expect(result).toEqual(mockTrip);
    });
  });

  describe('Profile Management', () => {
    test('viewProfile should return user profile', async () => {
      const mockProfile = { _id: mockUserId, name: 'Test User' };
      userModel.findById.mockResolvedValue(mockProfile);

      const result = await userService.viewProfile(mockUserId);
      expect(userModel.findById).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual(mockProfile);
    });

    test('updateProfile should update user details', async () => {
      const mockUser = {
        _id: mockUserId,
        email: 'old@test.com',
        name: 'Old Name',
        password: 'oldpass',
        save: jest.fn().mockResolvedValue(true)
      };
      userModel.findById.mockResolvedValue(mockUser);

      const updates = { email: 'new@test.com', name: 'New Name' };
      await userService.updateProfile(mockUserId, updates);

      expect(userModel.findById).toHaveBeenCalledWith(mockUserId);
      expect(mockUser.email).toBe('new@test.com');
      expect(mockUser.name).toBe('New Name');
      expect(mockUser.save).toHaveBeenCalled();
    });
  });

  describe('Booking Operations', () => {
    const mockBookData = {
      seats: 2,
      seatNumbers: ['A1', 'A2']
    };
    const mockTrip = {
      _id: mockTripId,
      availableSeats: 10,
      seatNumbers: ['A1', 'A2', 'B1', 'B2'],
      price: 500,
      save: jest.fn().mockResolvedValue(true)
    };
    const mockUser = {
      _id: mockUserId,
      bookings: [],
      save: jest.fn().mockResolvedValue(true)
    };

    test('bookTickets should create a booking with valid data', async () => {
      userModel.findById.mockResolvedValue(mockUser);
      tripModel.findById.mockResolvedValue(mockTrip);
      bookingModel.create.mockResolvedValue({ 
        _id: mockBookingId,
        ...mockBookData,
        totalPrice: mockBookData.seats * mockTrip.price
      });

      const result = await userService.bookTickets(mockUserId, mockTripId, mockBookData);
      
      expect(userModel.findById).toHaveBeenCalledWith(mockUserId);
      expect(tripModel.findById).toHaveBeenCalledWith(mockTripId);
      expect(bookingModel.create).toHaveBeenCalled();
      expect(result.totalPrice).toBe(mockBookData.seats * mockTrip.price);
      expect(mockUser.bookings).toContain(mockTripId);
      expect(mockTrip.availableSeats).toBe(10 - mockBookData.seats);
    });

    test('bookTickets should throw error for unavailable seats', async () => {
      const invalidBookData = { ...mockBookData, seatNumbers: ['A1', 'X1'] };
      userModel.findById.mockResolvedValue(mockUser);
      tripModel.findById.mockResolvedValue(mockTrip);

      await expect(userService.bookTickets(mockUserId, mockTripId, invalidBookData))
        .rejects.toThrow('Some seat numbers are not available');
    });

    test('getBookings should return user bookings', async () => {
      const mockBookings = [{ _id: 'booking1' }, { _id: 'booking2' }];
      bookingModel.find.mockResolvedValue(mockBookings);

      const result = await userService.getBookings(mockUserId);
      expect(bookingModel.find).toHaveBeenCalledWith({ userId: mockUserId });
      expect(result).toEqual(mockBookings);
    });

    test('getBooking should return specific booking', async () => {
      const mockBooking = { _id: mockBookingId };
      bookingModel.findById.mockResolvedValue(mockBooking);

      const result = await userService.getBooking(mockBookingId);
      expect(bookingModel.findById).toHaveBeenCalledWith(mockBookingId);
      expect(result).toEqual(mockBooking);
    });

    test('cancelBooking should cancel a booking', async () => {
        const mockBooking = {
          _id: mockBookingId,
          userId: mockUserId,
          tripId: mockTripId,
          seatsBooked: ['A1', 'A2'],
          bookingStatus: 'Confirmed',
          paymentStatus: 'Pending',
          save: jest.fn().mockResolvedValue(true)
        };
        
        const mockTrip = {
          _id: mockTripId,
          availableSeats: 10,
          seatNumbers: ['B1', 'B2'], // Initial seats
          save: jest.fn().mockResolvedValue(true)
        };
        
        bookingModel.findById.mockResolvedValue(mockBooking);
        tripModel.findById.mockResolvedValue(mockTrip);
      
        const result = await userService.cancelBooking(mockBookingId);
        
        expect(bookingModel.findById).toHaveBeenCalledWith(mockBookingId);
        expect(tripModel.findById).toHaveBeenCalledWith(mockTripId);
        expect(result.bookingStatus).toBe('Cancelled');
        
        expect(mockTrip.seatNumbers).toEqual(expect.arrayContaining(['A1', 'A2']));
        expect(mockTrip.availableSeats).toBe(12); 
      });
  });

});