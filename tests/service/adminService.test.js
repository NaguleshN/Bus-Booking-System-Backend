import AdminService from '../../services/adminService.js';
import userModel from '../../models/userModel.js';
import tripModel from '../../models/tripModel.js';

jest.mock('../../models/userModel.js');
jest.mock('../../models/tripModel.js');

describe('AdminService', () => {
  let adminService;

  const mockUser = {
    _id: 'user123',
    name: 'Test User',
    email: 'user@test.com',
    role: 'user',
    isBlocked: false,
    save: jest.fn()
  };

  const mockOperator = {
    _id: 'operator123',
    name: 'Test Operator',
    email: 'operator@test.com',
    role: 'operator',
    isVerified: false,
    save: jest.fn()
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
    status: 'Scheduled',
    save: jest.fn()
  };

  const cancelledTrip = {
    ...mockTrip,
    status: 'Cancelled'
  };

  const verifiedOperator = {
    ...mockOperator,
    isVerified: true
  };

  beforeEach(() => {
    adminService = new AdminService();
    jest.clearAllMocks();

    mockUser.save.mockImplementation(function() {
      return Promise.resolve(this);
    });
    mockOperator.save.mockImplementation(function() {
      return Promise.resolve(this);
    });
    mockTrip.save.mockImplementation(function() {
      return Promise.resolve(this);
    });
  });

  describe('User Management', () => {
    test('getAllUsers - should return all users', async () => {
      userModel.find.mockResolvedValue([mockUser, mockUser]);

      const result = await adminService.getAllUsers();

      expect(userModel.find).toHaveBeenCalledWith({ role: 'user' });
      expect(result).toHaveLength(2);
      expect(result[0]._id).toBe('user123');
    });

    test('getUser - should return a specific user', async () => {
      userModel.findById.mockResolvedValue(mockUser);

      const result = await adminService.getUser('user123');

      expect(userModel.findById).toHaveBeenCalledWith('user123');
      expect(result._id).toBe('user123');
    });

    test('getUser - should throw error if user not found', async () => {
      userModel.findById.mockResolvedValue(null);

      await expect(adminService.getUser('invalid'))
        .rejects.toThrow('User is not found');
    });

    test('blockUnblockUser - should block a user', async () => {
      userModel.findById.mockResolvedValue(mockUser);
      mockUser.isBlocked = false;

      const result = await adminService.blockUnblockUser('user123');

      expect(userModel.findById).toHaveBeenCalledWith('user123');
      expect(mockUser.isBlocked).toBe(true);
      expect(mockUser.save).toHaveBeenCalled();
      expect(result.isBlocked).toBe(true);
    });

    test('blockUnblockUser - should unblock a user', async () => {
      userModel.findById.mockResolvedValue({ ...mockUser, isBlocked: true });

      const result = await adminService.blockUnblockUser('user123');

      expect(result.isBlocked).toBe(false);
    });

    test('blockUnblockUser - should throw error if user not found', async () => {
      userModel.findById.mockResolvedValue(null);

      await expect(adminService.blockUnblockUser('invalid'))
        .rejects.toThrow('User is not found');
    });
  });

  describe('Operator Management', () => {
    test('getAllOperator - should return all operators', async () => {
      userModel.find.mockResolvedValue([mockOperator, mockOperator]);

      const result = await adminService.getAllOperator();

      expect(userModel.find).toHaveBeenCalledWith({ role: 'operator' });
      expect(result).toHaveLength(2);
      expect(result[0]._id).toBe('operator123');
    });

    test('getOperator - should return a specific operator', async () => {
      userModel.findById.mockResolvedValue(mockOperator);

      const result = await adminService.getOperator('operator123');

      expect(userModel.findById).toHaveBeenCalledWith('operator123');
      expect(result._id).toBe('operator123');
    });

    test('getOperator - should throw error if operator not found', async () => {
      userModel.findById.mockResolvedValue(null);

      await expect(adminService.getOperator('invalid'))
        .rejects.toThrow('Operator is not found');
    });

    test('approveOperator - should approve an operator', async () => {
      userModel.findById.mockResolvedValue(mockOperator);

      const result = await adminService.approveOperator('operator123');

      expect(userModel.findById).toHaveBeenCalledWith('operator123');
      expect(mockOperator.isVerified).toBe(true);
      expect(mockOperator.save).toHaveBeenCalled();
      expect(result.isVerified).toBe(true);
    });

    test('approveOperator - should work when operator already verified', async () => {
      userModel.findById.mockResolvedValue(verifiedOperator);

      const result = await adminService.approveOperator('operator123');

      expect(result.isVerified).toBe(true);
    });

    test('approveOperator - should throw error for non-operator', async () => {
      userModel.findById.mockResolvedValue(mockUser);

      await expect(adminService.approveOperator('user123'))
        .rejects.toThrow('Operator is not found');
    });

    test('approveOperator - should throw error if operator not found', async () => {
      userModel.findById.mockResolvedValue(null);

      await expect(adminService.approveOperator('invalid'))
        .rejects.toThrow('Operator is not found');
    });
  });

  describe('Trip Management', () => {
    test('getAllTrips - should return all trips', async () => {
      tripModel.find.mockResolvedValue([mockTrip, mockTrip]);

      const result = await adminService.getAllTrips();

      expect(tripModel.find).toHaveBeenCalledWith();
      expect(result).toHaveLength(2);
      expect(result[0]._id).toBe('trip123');
    });

    test('getTrip - should return a specific trip', async () => {
      tripModel.findById.mockResolvedValue(mockTrip);

      const result = await adminService.getTrip('trip123');

      expect(tripModel.findById).toHaveBeenCalledWith('trip123');
      expect(result._id).toBe('trip123');
    });

    test('getTrip - should throw error if trip not found', async () => {
      tripModel.findById.mockResolvedValue(null);

      await expect(adminService.getTrip('invalid'))
        .rejects.toThrow('Trip is not found');
    });

    test('updateTrip - should update trip details', async () => {
      const updateData = {
        source: 'Chicago',
        price: 75
      };
      tripModel.findByIdAndUpdate.mockResolvedValue({
        ...mockTrip,
        ...updateData
      });

      const result = await adminService.updateTrip(updateData, 'trip123');

      expect(tripModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'trip123',
        { $set: updateData }
      );
      expect(result.source).toBe('Chicago');
      expect(result.price).toBe(75);
    });

    test('updateTrip - should handle empty update data', async () => {
      tripModel.findByIdAndUpdate.mockResolvedValue(mockTrip);

      const result = await adminService.updateTrip({}, 'trip123');

      expect(tripModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'trip123',
        { $set: {} }
      );
      expect(result).toEqual(mockTrip);
    });

    test('updateTrip - should update only source field', async () => {
      const updateData = { source: 'Chicago' };
      tripModel.findByIdAndUpdate.mockResolvedValue({
        ...mockTrip,
        source: 'Chicago'
      });

      const result = await adminService.updateTrip(updateData, 'trip123');

      expect(result.source).toBe('Chicago');
      expect(result.destination).toBe('Boston');
    });

    test('updateTrip - should update only destination field', async () => {
      const updateData = { destination: 'Chicago' };
      tripModel.findByIdAndUpdate.mockResolvedValue({
        ...mockTrip,
        destination: 'Chicago'
      });

      const result = await adminService.updateTrip(updateData, 'trip123');

      expect(result.source).toBe('New York');
      expect(result.destination).toBe('Chicago');
    });

    
    test('updateTrip - should update only departureTime, arrivalTime, and availableSeats fields', async () => {
      const updateData = {
        departureTime: '2025-04-20T09:00:00Z',
        arrivalTime: '2025-04-20T15:00:00Z',
        availableSeats: 30
      };

      tripModel.findByIdAndUpdate.mockResolvedValue({
        ...mockTrip,
        departureTime: updateData.departureTime,
        arrivalTime: updateData.arrivalTime,
        availableSeats: updateData.availableSeats
      });

      const result = await adminService.updateTrip(updateData, 'trip123');

      expect(result.departureTime).toBe(updateData.departureTime);
      expect(result.arrivalTime).toBe(updateData.arrivalTime);
      expect(result.availableSeats).toBe(updateData.availableSeats);
      expect(result.destination).toBe(mockTrip.destination); 
      expect(result.source).toBe(mockTrip.source);           
    });


    test('cancelTrip - should cancel a trip', async () => {
      tripModel.findById.mockResolvedValue(mockTrip);
      mockTrip.save.mockResolvedValue(cancelledTrip);

      const result = await adminService.cancelTrip('trip123');

      expect(tripModel.findById).toHaveBeenCalledWith('trip123');
      expect(mockTrip.status).toBe('Cancelled');
      expect(mockTrip.save).toHaveBeenCalled();
      expect(result.status).toBe('Cancelled');
    });

    test('cancelTrip - should throw error if trip not found', async () => {
      tripModel.findById.mockResolvedValue(null);

      await expect(adminService.cancelTrip('invalid'))
        .rejects.toThrow('Trip is not found');
    });

    test('cancelTrip - should throw error if trip already cancelled', async () => {
      tripModel.findById.mockResolvedValue(cancelledTrip);

      await expect(adminService.cancelTrip('trip123'))
        .rejects.toThrow('Trip is already cancelled');
    });
  });
});