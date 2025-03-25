import OperatorService from '../../services/operatorService.js';
import userModel from '../../models/userModel.js';
import busModel from '../../models/busModel.js';
import tripModel from '../../models/tripModel.js';

// Mock the models
jest.mock('../../models/userModel.js');
jest.mock('../../models/busModel.js');
jest.mock('../../models/tripModel.js');
// import OperatorService from '../services/operatorService.js';
// import userModel from '../models/userModel.js';
// import busModel from '../models/busModel.js';
// import tripModel from '../models/tripModel.js';

// // Mock the models
// jest.mock('../models/userModel.js');
// jest.mock('../models/busModel.js');
// jest.mock('../models/tripModel.js');

describe('OperatorService', () => {
  let operatorService;

  // Mock data
  const mockOperator = {
    _id: 'operator123',
    role: 'operator'
  };

  const mockBus = {
    _id: 'bus123',
    operatorId: 'operator123',
    busNumber: 'BUS001',
    busType: 'AC',
    setlayout: [],
    amenities: ['TV', 'WiFi'],
    totalSeats: 20
  };

  const mockTrip = {
    _id: 'trip123',
    operatorId: 'operator123',
    busId: 'bus123',
    source: 'New York',
    destination: 'Boston',
    departureTime: new Date(),
    arrivalTime: new Date(),
    price: 50,
    availableSeats: 20,
    status: 'Scheduled'
  };

  beforeEach(() => {
    operatorService = new OperatorService();
    jest.clearAllMocks();
  });

  describe('Bus Operations', () => {
    test('creatingBus - should create a new bus successfully', async () => {
      // Mock implementations
      userModel.findById.mockResolvedValue(mockOperator);
      busModel.findOne.mockResolvedValue(null);
      busModel.create.mockResolvedValue(mockBus);

      const result = await operatorService.creatingBus({
        operatorId: 'operator123',
        busNumber: 'BUS001',
        busType: 'AC',
        seats: [{ number: 'A1', booked: false }],
        amenities: ['TV', 'WiFi']
      });

      expect(userModel.findById).toHaveBeenCalledWith('operator123');
      expect(busModel.findOne).toHaveBeenCalledWith({ busNumber: 'BUS001' });
      expect(busModel.create).toHaveBeenCalled();
      expect(result).toEqual(mockBus);
    });

    test('creatingBus - should throw error for existing bus', async () => {
      busModel.findOne.mockResolvedValue(mockBus);

      await expect(operatorService.creatingBus({
        operatorId: 'operator123',
        busNumber: 'BUS001',
        busType: 'AC',
        seats: [{ number: 'A1', booked: false }]
      })).rejects.toThrow('Bus already exists');
    });

    test('updatingBus - should update bus successfully', async () => {
      busModel.findById.mockResolvedValue(mockBus);
      busModel.findByIdAndUpdate.mockResolvedValue({
        ...mockBus,
        busType: 'Non-AC'
      });

      const result = await operatorService.updatingBus(
        { busType: 'Non-AC', seats: [{ number: 'A1', booked: false }] },
        'bus123'
      );

      expect(busModel.findById).toHaveBeenCalledWith('bus123');
      expect(busModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(result.busType).toBe('Non-AC');
    });

    test('deletingBus - should delete bus successfully', async () => {
      busModel.findById.mockResolvedValue(mockBus);
      busModel.findByIdAndDelete.mockResolvedValue(mockBus);

      const result = await operatorService.deletingBus('bus123');

      expect(busModel.findById).toHaveBeenCalledWith('bus123');
      expect(busModel.findByIdAndDelete).toHaveBeenCalledWith('bus123');
      expect(result).toEqual(mockBus);
    });
  });

  describe('Trip Operations', () => {
    test('creatingTrip - should create a new trip successfully', async () => {
      userModel.findById.mockResolvedValue(mockOperator);
      busModel.findById.mockResolvedValue(mockBus);
      tripModel.create.mockResolvedValue(mockTrip);

      const result = await operatorService.creatingTrip({
        operatorId: 'operator123',
        busId: 'bus123',
        source: 'New York',
        destination: 'Boston',
        departureTime: new Date(),
        arrivalTime: new Date(),
        price: 50,
        availableSeats: 20
      });

      expect(userModel.findById).toHaveBeenCalledWith('operator123');
      expect(busModel.findById).toHaveBeenCalledWith('bus123');
      expect(tripModel.create).toHaveBeenCalled();
      expect(result).toEqual(mockTrip);
    });

    test('updatingTrip - should update trip successfully', async () => {
      userModel.findById.mockResolvedValue(mockOperator);
      busModel.findById.mockResolvedValue(mockBus);
      tripModel.findByIdAndUpdate.mockResolvedValue({
        ...mockTrip,
        price: 60
      });

      const result = await operatorService.updatingTrip(
        { price: 60, operatorId: 'operator123', busId: 'bus123' },
        'trip123'
      );

      expect(tripModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(result.price).toBe(60);
    });

    test('deletingTrip - should delete trip successfully', async () => {
      tripModel.findById.mockResolvedValue(mockTrip);
      tripModel.findByIdAndDelete.mockResolvedValue(mockTrip);

      const result = await operatorService.deletingTrip('trip123');

      expect(tripModel.findById).toHaveBeenCalledWith('trip123');
      expect(tripModel.findByIdAndDelete).toHaveBeenCalledWith('trip123');
      expect(result).toEqual(mockTrip);
    });

    test('fetchingTrip - should fetch trips by operator', async () => {
      tripModel.find.mockResolvedValue([mockTrip, mockTrip]);

      const result = await operatorService.fetchingTrip('operator123');

      expect(tripModel.find).toHaveBeenCalledWith({ operatorId: 'operator123' });
      expect(result).toHaveLength(2);
    });
  });

  describe('Error Handling', () => {
    test('should throw error for invalid operator', async () => {
      userModel.findById.mockResolvedValue(null);
      busModel.findOne.mockResolvedValue(null); // Add this to prevent "Bus already exists" error

      await expect(operatorService.creatingBus({
        operatorId: 'invalid',
        busNumber: 'NEWBUS001', // Different bus number to avoid "already exists" error
        busType: 'AC',
        seats: [{ number: 'A1', booked: false }]
      })).rejects.toThrow('Operator is Invalid');
    });

    test('should throw error for invalid bus type', async () => {
      userModel.findById.mockResolvedValue(mockOperator);
      busModel.findOne.mockResolvedValue(null); // Add this to prevent "Bus already exists" error

      await expect(operatorService.creatingBus({
        operatorId: 'operator123',
        busNumber: 'NEWBUS002', // Different bus number to avoid "already exists" error
        busType: 'Invalid',
        seats: [{ number: 'A1', booked: false }]
      })).rejects.toThrow('Bus Type is not Valid');
    });

    test('should throw error when bus not found for deletion', async () => {
      busModel.findById.mockResolvedValue(null);

      await expect(operatorService.deletingBus('invalid'))
        .rejects.toThrow('Bus not Exists');
    });
  });
});