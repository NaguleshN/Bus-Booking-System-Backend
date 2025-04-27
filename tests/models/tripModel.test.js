import mongoose from 'mongoose';
import tripModel from '../../models/tripModel.js';
import { MongoMemoryServer } from 'mongodb-memory-server';
import userModel from '../../models/userModel.js';

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), { dbName: 'verifyTrip' });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Trip Model Schema Validation', () => {
    it('should save a valid trip', async () => {
        const validTrip = new tripModel({
            operatorId: new mongoose.Types.ObjectId(),
            busId: new mongoose.Types.ObjectId(),
            source: "City A",
            destination: "City B",
            arrivalTime: new Date('2025-04-20T12:00:00Z'),
            departureTime: new Date('2025-04-20T08:00:00Z'),
            price: 500,
            seatNumbers: [1, 2, 3, 4],
            availableSeats: 4
        });

        const savedTrip = await validTrip.save();
        expect(savedTrip._id).toBeDefined();
        expect(savedTrip.status).toBe("Scheduled"); 
        expect(savedTrip.createdAt).toBeDefined();
        expect(savedTrip.updatedAt).toBeDefined();
        expect(savedTrip.createdAt instanceof Date).toBe(true);
        expect(savedTrip.updatedAt instanceof Date).toBe(true);
    });

    it('should not re-hash the password if it is not modified', async () => {
        const user = new userModel({
          name: 'Skip Hash',
          email: 'skip@example.com',
          phone: '9876543210',
          password: 'initialpass'
        });
      
        await user.save();
        const originalHashedPassword = user.password;
      
        user.name = 'Updated Name';
        await user.save();
      
        expect(user.password).toBe(originalHashedPassword); 
      });
      

    it('should throw validation error if departureTime is after arrivalTime', async () => {
        const invalidTrip = new tripModel({
            operatorId: new mongoose.Types.ObjectId(),
            busId: new mongoose.Types.ObjectId(),
            source: "City A",
            destination: "City B",
            arrivalTime: new Date('2025-04-20T10:00:00Z'),
            departureTime: new Date('2025-04-20T12:00:00Z'), 
            price: 300,
            seatNumbers: [1, 2],
            availableSeats: 2
        });

        await expect(invalidTrip.validate()).rejects.toThrow("Departure time must be before arrival time.");
    });


    it('should throw validation error if availableSeats does not match seatNumbers length', async () => {
        const invalidTrip = new tripModel({
            operatorId: new mongoose.Types.ObjectId(),
            busId: new mongoose.Types.ObjectId(),
            source: "City A",
            destination: "City B",
            arrivalTime: new Date('2025-04-20T12:00:00Z'),
            departureTime: new Date('2025-04-20T08:00:00Z'),
            price: 400,
            seatNumbers: [1, 2, 3],
            availableSeats: 2 // Mismatch
        });

        await expect(invalidTrip.validate()).rejects.toThrow("Available seats count must match the number of seat numbers.");
    });

    it('should throw validation error if price is negative', async () => {
        const invalidTrip = new tripModel({
            operatorId: new mongoose.Types.ObjectId(),
            busId: new mongoose.Types.ObjectId(),
            source: "City A",
            destination: "City B",
            arrivalTime: new Date('2025-04-20T12:00:00Z'),
            departureTime: new Date('2025-04-20T08:00:00Z'),
            price: -10,
            seatNumbers: [1],
            availableSeats: 1
        });

        await expect(invalidTrip.validate()).rejects.toThrow("Path `price` (-10) is less than minimum allowed value (0).");
    });

    it('should throw validation error if status is not in allowed enum', async () => {
        const invalidTrip = new tripModel({
            operatorId: new mongoose.Types.ObjectId(),
            busId: new mongoose.Types.ObjectId(),
            source: "City A",
            destination: "City B",
            arrivalTime: new Date('2025-04-20T12:00:00Z'),
            departureTime: new Date('2025-04-20T08:00:00Z'),
            price: 400,
            seatNumbers: [1],
            availableSeats: 1,
            status: "Delayed" // Invalid enum
        });

        await expect(invalidTrip.validate()).rejects.toThrow("`Delayed` is not a valid enum value");
    });

    it('should throw validation error if required fields are missing', async () => {
        const invalidTrip = new tripModel({}); // empty

        await expect(invalidTrip.validate()).rejects.toThrow(/`operatorId` is required/);
    });
});
