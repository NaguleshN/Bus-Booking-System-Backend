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
      amenities: 'WiFi,AC,TV'
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
      userModel.findById.mockResolvedValue(null);
      busModel.findOne.mockResolvedValue({}); 

      await expect(operatorService.creatingBus(mockOperatorId, mockBusData))
        .rejects.toThrow('Bus already exists');
    });

    test('creatingBus should throw error for invalid bus type', async () => {
      const mockOperator = { _id: mockOperatorId, role: 'operator' };
    
      userModel.findById.mockResolvedValue(mockOperator);
      const invalidBusData = { ...mockBusData, busType: 'InvalidType' };
      busModel.findOne.mockResolvedValue(null);
      busModel.create.mockResolvedValue({ ...invalidBusData, _id: mockBusId });
    
      await expect(operatorService.creatingBus(mockOperatorId, invalidBusData))
        .rejects.toThrow('Bus Type is not Valid');
    });

    test('creatingBus should throw error for zero seats', async () => {
      const mockOperator = { _id: mockOperatorId, role: 'operator' };
      userModel.findById.mockResolvedValue(mockOperator);
    
      const invalidBusData = { ...mockBusData, seats: 0 };
      busModel.findOne.mockResolvedValue(null);
    
      await expect(operatorService.creatingBus(mockOperatorId, invalidBusData))
        .rejects.toThrow('At least one seat required');
    });

    test('updatingBus should update bus details', async () => {
      const updatedData = { ...mockBusData, busType: 'Non-AC', amenities: 'WiFi', seats: 50, busNumber: 'KA02AB1234' };
      busModel.findById.mockResolvedValue({ _id: mockBusId });
      busModel.findByIdAndUpdate.mockResolvedValue(updatedData);

      const result = await operatorService.updatingBus(updatedData, mockBusId);
      expect(busModel.findById).toHaveBeenCalledWith(mockBusId);
      expect(busModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toEqual(updatedData);
    });

    test('updatingBus should update only busType when other fields are missing', async () => {
      const busData = { busType: 'Sleeper' };
      busModel.findById.mockResolvedValue({ _id: mockBusId });
      busModel.findByIdAndUpdate.mockResolvedValue(busData);
    
      const result = await operatorService.updatingBus(busData, mockBusId);
      expect(result).toEqual(busData);
    });

    test('updatingBus should update only amenities when other fields are missing', async () => {
      const busData = { amenities: 'Charging Port' };
      busModel.findById.mockResolvedValue({ _id: mockBusId });
      busModel.findByIdAndUpdate.mockResolvedValue(busData);
    
      const result = await operatorService.updatingBus(busData, mockBusId);
      expect(result).toEqual(busData);
    });

    test('updatingBus should update only seats when other fields are missing', async () => {
      const busData = { seats: 35 };
      busModel.findById.mockResolvedValue({ _id: mockBusId });
      busModel.findByIdAndUpdate.mockResolvedValue(busData);
    
      const result = await operatorService.updatingBus(busData, mockBusId);
      expect(result).toEqual(busData);
    });

    
    test('updatingBus should update only busNumber when other fields are missing', async () => {
      const busData = { busNumber: 'KA01XY1234' };
      busModel.findById.mockResolvedValue({ _id: mockBusId });
      busModel.findByIdAndUpdate.mockResolvedValue(busData);
    
      const result = await operatorService.updatingBus(busData, mockBusId);
      expect(result).toEqual(busData);
    });

    test('updatingBus with invalid bus id', async () => {
      const updatedData = { ...mockBusData, busType: 'Non-AC' };
      const fakeBusId = 'fakeBusId';
      busModel.findById.mockResolvedValue(null);
      await expect(operatorService.updatingBus(updatedData, fakeBusId))
        .rejects.toThrow('Bus is Invalid');
      
    });

    test('updatingBus should throw error for invalid bus type', async () => {
      const updatedData = { ...mockBusData, busType: 'InvalidType' };
      busModel.findById.mockResolvedValue({ _id: mockBusId });
      busModel.findByIdAndUpdate.mockResolvedValue(updatedData);
    
      await expect(operatorService.updatingBus(updatedData, mockOperatorId))
        .rejects.toThrow('Bus Type is not Valid');
    });

    test('updatingBus should throw error for zero seats', async () => {
      const invalidBusData = { ...mockBusData, seats: 0 };
      busModel.findById.mockResolvedValue({ _id: mockBusId });
      busModel.findByIdAndUpdate.mockResolvedValue(invalidBusData);
    
      await expect(operatorService.updatingBus(invalidBusData, mockOperatorId))
        .rejects.toThrow('Atleast one seat required');
    });

    test('deletingBus should delete a bus', async () => {
      busModel.findById.mockResolvedValue({ _id: mockBusId });
      busModel.findByIdAndDelete.mockResolvedValue({ _id: mockBusId });

      const result = await operatorService.deletingBus(mockBusId);
      expect(busModel.findById).toHaveBeenCalledWith(mockBusId);
      expect(busModel.findByIdAndDelete).toHaveBeenCalledWith(mockBusId);
      expect(result).toEqual({ _id: mockBusId });
    });

    test('deletingBus should throw error for invalid bus id', async () => { 
      const fakeBusId = 'fakeBusId123';
      busModel.findById.mockResolvedValue(null);
      await expect(operatorService.deletingBus(fakeBusId))
        .rejects.toThrow('Bus not Exists');
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
    test('creatingTrip should throw error for invalid bus id', async () => { 
      const mockOperator = { _id: mockOperatorId, role: 'operator' };
      userModel.findById.mockResolvedValue(mockOperator);
      const fakeBusId = 'fakeBusId123';
      tripModel.create.mockResolvedValue({ ...mockTripData,busId: fakeBusId, _id: mockTripId });
      busModel.findById.mockResolvedValue(null);
      const updatedData = { ...mockTripData, busId: fakeBusId };
      await expect(operatorService.creatingTrip(mockOperatorId, updatedData))
        .rejects.toThrow('Bus not exists');
    });

    test('creatingTrip - should throw error if operator is invalid', async () => {

      const invalidOperatorId = 'invalidOperator123';
      const mockBus = { _id: mockBusId };
      busModel.findById.mockResolvedValue(mockBus);
    
      userModel.findById.mockResolvedValue({ _id: invalidOperatorId, role: 'user' });
    
      await expect(operatorService.creatingTrip(invalidOperatorId, mockTripData))
        .rejects.toThrow('Operator is Invalid');
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

    test('updatingTrip - should throw error if busId is provided but bus not found', async () => {
      const tripData = { busId: 'invalidBusId' };
      busModel.findById = jest.fn().mockResolvedValue(null);
    
      await expect(operatorService.updatingTrip(tripData, 'trip123', 'operator123'))
        .rejects.toThrow('Bus is Invalid');
    });

    test('updatingTrip - should throw error if operator not found or role is invalid', async () => {
      const tripData = { source: 'NYC' };
      userModel.findById = jest.fn().mockResolvedValue(null);
    
      await expect(operatorService.updatingTrip(tripData, 'trip123', 'operator123'))
        .rejects.toThrow('Bus is Invalid');
    
      userModel.findById = jest.fn().mockResolvedValue({ _id: 'operator123', role: 'user' });
    
      await expect(operatorService.updatingTrip(tripData, 'trip123', 'operator123'))
        .rejects.toThrow('Bus is Invalid');
    });
    
    test('updatingTrip - should update only destination and price', async () => {
      const tripData = {
        destination: 'Chicago',
        price: 150
      };
    
      const mockOperator = { _id: 'operator123', role: 'operator' };
      const mockUpdatedTrip = { ...tripData, _id: 'trip123' };
    
      userModel.findById = jest.fn().mockResolvedValue(mockOperator);
      tripModel.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedTrip);
    
      const result = await operatorService.updatingTrip(tripData, 'trip123', 'operator123');
    
      expect(result).toEqual(mockUpdatedTrip);
      expect(tripModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'trip123',
        { $set: { destination: 'Chicago', price: 150 } }
      );
    });
    
    test('updatingTrip - should do nothing if no fields passed but operator is valid', async () => {
      const tripData = {};
    
      const mockOperator = { _id: 'operator123', role: 'operator' };
      const mockTrip = { _id: 'trip123' };
    
      userModel.findById = jest.fn().mockResolvedValue(mockOperator);
      tripModel.findByIdAndUpdate = jest.fn().mockResolvedValue(mockTrip);
    
      const result = await operatorService.updatingTrip(tripData, 'trip123', 'operator123');
    
      expect(result).toEqual(mockTrip);
      expect(tripModel.findByIdAndUpdate).toHaveBeenCalledWith('trip123', { $set: {} });
    });
  
    test('deletingTrip - should delete trip successfully when trip exists', async () => {
      const mockTrip = [{ _id: 'trip123', userId: 'user123' }];
      const mockDeletedTrip = { _id: 'trip123', source: 'NYC' };
    
      tripModel.find = jest.fn().mockResolvedValue(mockTrip);
      tripModel.findByIdAndDelete = jest.fn().mockResolvedValue(mockDeletedTrip);
    
      const result = await operatorService.deletingTrip('user123', 'trip123');
    
      expect(result).toEqual(mockDeletedTrip);
      expect(tripModel.find).toHaveBeenCalledWith({ _id: 'trip123', userId: 'user123' });
      expect(tripModel.findByIdAndDelete).toHaveBeenCalledWith('trip123');
    });
    
    test('deletingTrip - should throw error if trip does not exist', async () => {
      tripModel.find = jest.fn().mockResolvedValue([]); 
    
      await expect(operatorService.deletingTrip('user123', 'trip123'))
        .rejects.toThrow('Trip is Invalid');
    
      expect(tripModel.find).toHaveBeenCalledWith({ _id: 'trip123', userId: 'user123' });
    });

    test('deletingTrip - should throw error if trip is null', async () => {
      tripModel.find = jest.fn().mockResolvedValue(null); 
    
      await expect(operatorService.deletingTrip('user123', 'trip123'))
        .rejects.toThrow('Trip is Invalid');
    });
    

    test('fetchingTrip :should return trips when operator has trips', async () => {
      const mockTrips = [{ _id: 'trip1', source: 'NY', destination: 'LA' }];
      tripModel.find = jest.fn().mockResolvedValue(mockTrips);
  
      const result = await operatorService.fetchingTrip('operator123');
  
      expect(result).toEqual(mockTrips);
      expect(tripModel.find).toHaveBeenCalledWith({ operatorId: 'operator123' });
    });
  
    test('fetchingTrip :should throw error when no trips found for operator', async () => {
      tripModel.find = jest.fn().mockResolvedValue([]); 
  
      await expect(operatorService.fetchingTrip('operator123'))
        .rejects.toThrow('Trips not found');
    });


    test('getTrip should return a specific trip', async () => {
      const mockTrip = { _id: mockTripId };
      tripModel.findById.mockResolvedValue(mockTrip);

      const result = await operatorService.getTrip(mockTripId);
      expect(tripModel.findById).toHaveBeenCalledWith(mockTripId);
      expect(result).toEqual(mockTrip);
    });

    test('getTrip should throw error when trip is not found', async () => {
      tripModel.findById = jest.fn().mockResolvedValue(null);  
      await expect(operatorService.getTrip('trip123'))
        .rejects.toThrow('Trip is not found'); 
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

    test('cancelTrip should throw error when trip is already cancelled', async () => {
      const mockTrip = { 
        _id: mockTripId, 
        userId: mockOperatorId,
        status: 'Cancelled',
        save: jest.fn()
      };
      tripModel.findOne.mockResolvedValue(mockTrip);

      await expect(operatorService.cancelTrip(mockOperatorId, mockTripId))
        .rejects.toThrow('Trip is already cancelled');
    });
    test('cancelTrip should throw error when trip is null', async () => {
      tripModel.findOne.mockResolvedValue(null);

      await expect(operatorService.cancelTrip(mockOperatorId, mockTripId))
        .rejects.toThrow('Trip is not found');
    });
    test('cancelTrip should throw error when trip is not found', async () => {
      tripModel.findOne.mockResolvedValue(null);

      await expect(operatorService.cancelTrip(mockOperatorId, mockTripId))
        .rejects.toThrow('Trip is not found');
    });
  });
});