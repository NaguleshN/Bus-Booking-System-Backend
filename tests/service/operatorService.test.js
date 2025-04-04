import OperatorService from '../../services/operatorService.js';
import userModel from '../../models/userModel.js'; 
import busModel from '../../models/busModel.js';
import tripModel from '../../models/tripModel.js';

jest.mock('../../models/userModel.js');
jest.mock('../../models/busModel.js');
jest.mock('../../models/tripModel.js');

describe('OperatorService', () => {
  let operatorService;

  beforeEach(() => {
    operatorService = new OperatorService();
    jest.clearAllMocks();
  });

  describe('Bus Management', () => {
    const mockOperatorId = 'operator123';
    const mockBusId = 'bus123';
    const mockBusData = {
      busNumber: 'KA01AB1234',
      busType: 'AC',
      seats: 40,
      amenities: ['WiFi', 'AC', 'TV']
    };

    test('getBuses should return all buses', async () => {
      const mockBuses = [{ _id: 'bus1' }, { _id: 'bus2' }];
      busModel.find.mockResolvedValue(mockBuses);

      const result = await operatorService.getBuses();
      expect(busModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockBuses);
    });

    test('getBus should return a specific bus', async () => {
      const mockBus = { _id: mockBusId };
      busModel.findById.mockResolvedValue(mockBus);

      const result = await operatorService.getBus(mockBusId);
      expect(busModel.findById).toHaveBeenCalledWith(mockBusId);
      expect(result).toEqual(mockBus);
    });

    test('creatingBus should create a new bus with valid data', async () => {
      const mockOperator = { _id: mockOperatorId, role: 'operator' };
      userModel.findById.mockResolvedValue(mockOperator);
      busModel.findOne.mockResolvedValue(null);
      busModel.create.mockResolvedValue({ ...mockBusData, _id: mockBusId });

      const result = await operatorService.creatingBus(mockOperatorId, mockBusData);
      expect(userModel.findById).toHaveBeenCalledWith(mockOperatorId);
      expect(busModel.findOne).toHaveBeenCalledWith({ busNumber: mockBusData.busNumber });
      expect(busModel.create).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining(mockBusData));
    });

    test('creatingBus should throw error for invalid operator', async () => {
      userModel.findById.mockResolvedValue(null);

      await expect(operatorService.creatingBus(mockOperatorId, mockBusData))
        .rejects.toThrow('Operator is Invalid');
    });

    test('creatingBus should throw error for duplicate bus number', async () => {
      const mockOperator = { _id: mockOperatorId, role: 'operator' };
      userModel.findById.mockResolvedValue(mockOperator);
      busModel.findOne.mockResolvedValue({}); // Simulate existing bus

      await expect(operatorService.creatingBus(mockOperatorId, mockBusData))
        .rejects.toThrow('Bus already exists');
    });

    test('updatingBus should update bus details', async () => {
      const updatedData = { ...mockBusData, busType: 'Non-AC' };
      busModel.findById.mockResolvedValue({ _id: mockBusId });
      busModel.findByIdAndUpdate.mockResolvedValue(updatedData);

      const result = await operatorService.updatingBus(updatedData, mockBusId);
      expect(busModel.findById).toHaveBeenCalledWith(mockBusId);
      expect(busModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toEqual(updatedData);
    });

    test('deletingBus should delete a bus', async () => {
      busModel.findById.mockResolvedValue({ _id: mockBusId });
      busModel.findByIdAndDelete.mockResolvedValue({ _id: mockBusId });

      const result = await operatorService.deletingBus(mockBusId);
      expect(busModel.findById).toHaveBeenCalledWith(mockBusId);
      expect(busModel.findByIdAndDelete).toHaveBeenCalledWith(mockBusId);
      expect(result).toEqual({ _id: mockBusId });
    });
  });

  describe('Trip Management', () => {
    const mockOperatorId = 'operator123';
    const mockTripId = 'trip123';
    const mockBusId = 'bus123';
    const mockTripData = {
      busId: mockBusId,
      source: 'City A',
      destination: 'City B',
      departureTime: new Date(),
      arrivalTime: new Date(),
      price: 500,
      seatNumbers: ['A1', 'A2', 'A3'],
      availableSeats: 40
    };

    test('creatingTrip should create a new trip', async () => {
      const mockOperator = { _id: mockOperatorId, role: 'operator' };
      const mockBus = { _id: mockBusId };
      userModel.findById.mockResolvedValue(mockOperator);
      busModel.findById.mockResolvedValue(mockBus);
      tripModel.create.mockResolvedValue({ ...mockTripData, _id: mockTripId });

      const result = await operatorService.creatingTrip(mockOperatorId, mockTripData);
      expect(userModel.findById).toHaveBeenCalledWith(mockOperatorId);
      expect(busModel.findById).toHaveBeenCalledWith(mockBusId);
      expect(tripModel.create).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining(mockTripData));
    });

    test('updatingTrip should update trip details', async () => {
      const updatedData = { ...mockTripData, price: 600 };
      busModel.findById.mockResolvedValue({ _id: mockBusId });
      userModel.findById.mockResolvedValue({ _id: mockOperatorId, role: 'operator' });
      tripModel.findByIdAndUpdate.mockResolvedValue(updatedData);

      const result = await operatorService.updatingTrip(updatedData, mockTripId, mockOperatorId);
      expect(busModel.findById).toHaveBeenCalledWith(mockBusId);
      expect(tripModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toEqual(updatedData);
    });

    test('fetchingTrip should return operator trips', async () => {
      const mockTrips = [{ _id: 'trip1' }, { _id: 'trip2' }];
      tripModel.find.mockResolvedValue(mockTrips);

      const result = await operatorService.fetchingTrip(mockOperatorId);
      expect(tripModel.find).toHaveBeenCalledWith({ operatorId: mockOperatorId });
      expect(result).toEqual(mockTrips);
    });

    test('getTrip should return a specific trip', async () => {
      const mockTrip = { _id: mockTripId };
      tripModel.findById.mockResolvedValue(mockTrip);

      const result = await operatorService.getTrip(mockTripId);
      expect(tripModel.findById).toHaveBeenCalledWith(mockTripId);
      expect(result).toEqual(mockTrip);
    });

    test('cancelTrip should cancel a trip', async () => {
      const mockTrip = { 
        _id: mockTripId, 
        userId: mockOperatorId,
        status: 'Active',
        save: jest.fn().mockResolvedValue({ ...mockTripData, status: 'Cancelled' })
      };
      tripModel.findOne.mockResolvedValue(mockTrip);

      const result = await operatorService.cancelTrip(mockOperatorId, mockTripId);
      expect(tripModel.findOne).toHaveBeenCalledWith({ _id: mockTripId, userId: mockOperatorId });
      expect(mockTrip.save).toHaveBeenCalled();
      expect(result.status).toBe('Cancelled');
    });
  });
});