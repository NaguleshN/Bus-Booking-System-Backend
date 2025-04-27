import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import userModel from '../../models/userModel.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { dbName: 'testUserModel' });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('User Model', () => {
  it('should hash the password before saving', async () => {
    const user = new userModel({
      name: process.env.TEST_USER_NAME,
      email: process.env.TEST_USER_EMAIL,
      phone: process.env.TEST_USER_PHONE,
      password: process.env.TEST_USER_PASSWORD
    });

    await user.save();
    // Ensure the stored password is not the plain text one
    expect(user.password).not.toBe(process.env.TEST_USER_PASSWORD);
    const isMatch = await bcrypt.compare(process.env.TEST_USER_PASSWORD, user.password);
    expect(isMatch).toBe(true);
  });

  it('should compare passwords correctly using comparePassword method', async () => {
    const user = await userModel.findOne({ email: process.env.TEST_USER_EMAIL });
    const match = await user.comparePassword(process.env.TEST_USER_PASSWORD);
    const wrong = await user.comparePassword('wrongpassword');

    expect(match).toBe(true);
    expect(wrong).toBe(false);
  });

  it('should not allow saving duplicate email or phone', async () => {
    const duplicate = new userModel({
      name: 'Duplicate User',
      email: process.env.TEST_USER_EMAIL,
      phone: process.env.TEST_USER_PHONE,
      password: 'anotherpass'
    });

    await expect(duplicate.save()).rejects.toThrow();
  });

  it('should throw validation error for missing required fields', async () => {
    const user = new userModel({
      email: 'test2@example.com',
      phone: '9998887777'
      // Missing required fields: name & password
    });

    await expect(user.validate()).rejects.toThrow(/`name` is required/);
  });

  it('should default role to "user"', async () => {
    const newUser = new userModel({
      name: 'Test User',
      email: 'test3@example.com',
      phone: '1112223333',
      password: 'pass123'
    });

    await newUser.save();
    expect(newUser.role).toBe('user');
  });

  it('should throw error if invalid role is provided', async () => {
    const invalidUser = new userModel({
      name: 'Invalid Role',
      email: 'invalid@example.com',
      phone: '4445556666',
      password: 'pass123',
      role: 'superuser' // Not in enum
    });

    await expect(invalidUser.validate()).rejects.toThrow(/`superuser` is not a valid enum value/);
  });

  it('should allow valid roles only', async () => {
    const operatorUser = new userModel({
      name: 'Operator',
      email: 'operator@example.com',
      phone: '2223334444',
      password: 'securepass',
      role: 'operator'
    });

    await expect(operatorUser.save()).resolves.toBeDefined();
    expect(operatorUser.role).toBe('operator');
  });
});
