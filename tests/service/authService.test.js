import AuthService from '../../services/authService.js';
import userModel from '../../models/userModel.js';
import jwt from 'jsonwebtoken';


jest.mock('../../models/userModel.js');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  const authService = new AuthService();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should throw error if email or password is missing', async () => {
      await expect(authService.register({ email: '', password: '' }))
        .rejects.toThrow('Email and password are required');
    });

    it('should throw error if user already exists', async () => {
      userModel.findOne.mockImplementation(({ email }) => email ? { _id: '123' } : null);

      await expect(authService.register({
        email: 'test@example.com',
        password: 'pass123',
        phone: '1234567890',
        name: 'John',
        lastName: 'Doe',
        role: 'user',
        compName: ''
      })).rejects.toThrow('User already exists');
    });

    it('should throw error if phone already exists', async () => {
      userModel.findOne
        .mockResolvedValueOnce(null) 
        .mockResolvedValueOnce({ _id: '456' });

      await expect(authService.register({
        email: 'test@example.com',
        password: 'pass123',
        phone: '1234567890',
        name: 'John',
        lastName: 'Doe',
        role: 'user',
        compName: ''
      })).rejects.toThrow('Phone already exists');
    });

    it('should register new user if email and phone are unique', async () => {
      userModel.findOne.mockResolvedValue(null);
      const createdUser = {
        _id: '789',
        name: 'John',
        email: 'test@example.com'
      };
      userModel.create.mockResolvedValue(createdUser);

      const result = await authService.register({
        name: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        phone: '1234567890',
        password: 'pass123',
        role: 'user',
        compName: 'TestComp'
      });

      expect(userModel.create).toHaveBeenCalledWith(expect.objectContaining({
        email: 'test@example.com',
        isVerified: true,
        companyName: ''
      }));
      expect(result).toEqual(createdUser);
    });

    it('should set the companyName to empty string if role is user', async () => {
      const createdUser = {
        _id: '789',
        name: 'John',
        email: 'test@example.com',
        companyName: 'TestComp'
      };
      userModel.create.mockResolvedValue(createdUser);

      const result = await authService.register({
        name: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        phone: '1234567890',
        password: 'pass123',
        role: 'operator',
        compName: 'TestComp'
      });

      expect(userModel.create).toHaveBeenCalledWith(expect.objectContaining({
        email: 'test@example.com',
        isVerified: false,
        companyName: 'TestComp'
      }));
      expect(result).toEqual(createdUser);
    });

  });

  describe('login', () => {
    it('should throw error if email or password is missing', async () => {
      await expect(authService.login({ email: '', password: '' }))
        .rejects.toThrow('Email and password are required');
    });

    it('should throw error if user not found', async () => {
      userModel.findOne.mockResolvedValue(null);

      await expect(authService.login({ email: 'user@test.com', password: '1234' }))
        .rejects.toThrow('User not found');
    });

    it('should throw error if password is invalid', async () => {
      const fakeUser = {
        comparePassword: jest.fn().mockResolvedValue(false)
      };
      userModel.findOne.mockResolvedValue(fakeUser);

      await expect(authService.login({ email: 'user@test.com', password: 'wrong' }))
        .rejects.toThrow('Invalid credentials');
    });

    // it('should return token on successful login', async () => {
    //   const fakeUser = {
    //     _id: 'user123',
    //     comparePassword: jest.fn().mockResolvedValue(true)
    //   };
    //   userModel.findOne.mockResolvedValue(fakeUser);
    //   jwt.sign.mockReturnValue('mocked-jwt-token');

    //   const result = await authService.login({ email: 'user@test.com', password: 'correct' });

    //   expect(jwt.sign).toHaveBeenCalledWith(
    //     { id: 'user123' },
    //     process.env.JWT_SECRET,
    //     { expiresIn: '1h' }
    //   );
    //   expect(result).toBe('mocked-jwt-token');
    // });


  });
});
