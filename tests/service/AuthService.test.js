import AuthService from '../../service/authService.js';
import userModel from '../../models/userModel.js';
import jwt from 'jsonwebtoken';


jest.mock('../../models/userModel.js');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let authService;
  
  const testUser = {
    _id: '507f191e810c19729de860ea',
    name: 'Test User',
    email: 'test@example.com',
    phone: '1234567890',
    password: 'hashedpassword',
    role: 'user',
    comparePassword: jest.fn()
  };

  beforeEach(() => {
    authService = new AuthService();
    process.env.JWT_SECRET = 'test-secret';
    jest.clearAllMocks();
  });

  describe('register()', () => {
    it('should register a new user with valid data', async () => {
      // Mock dependencies
      userModel.findOne.mockResolvedValue(null);
      userModel.create.mockResolvedValue(testUser);

      // Test data
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        password: 'password123',
        role: 'user'
      };

      const result = await authService.register(userData);

      expect(userModel.findOne).toHaveBeenCalledTimes(2);
      expect(userModel.create).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        password: 'password123',
        role: 'user',
        companyName: '',
        isVerified: true
      });
      expect(result).toEqual(testUser);
    });

    it('should throw error when email exists', async () => {
      userModel.findOne.mockResolvedValueOnce(testUser); // Email exists
      
      await expect(authService.register({
        email: 'test@example.com',
        password: 'password123'
      })).rejects.toThrow('User already exists');
    });

    it('should throw error when phone exists', async () => {
      userModel.findOne
        .mockResolvedValueOnce(null) // Email doesn't exist
        .mockResolvedValueOnce(testUser); // Phone exists
      
      await expect(authService.register({
        email: 'new@example.com',
        phone: '1234567890',
        password: 'password123'
      })).rejects.toThrow('Phone already exists');
    });

    it('should set companyName and isVerified for operators', async () => {
      userModel.findOne.mockResolvedValue(null);
      userModel.create.mockResolvedValue({
        ...testUser,
        role: 'operator'
      });

      const result = await authService.register({
        email: 'operator@test.com',
        password: 'password123',
        role: 'operator',
        compName: 'Test Company'
      });

      expect(userModel.create).toHaveBeenCalledWith(expect.objectContaining({
        companyName: 'Test Company',
        isVerified: false
      }));
    });
  });

  describe('login()', () => {
    it('should return JWT token for valid credentials', async () => {
      // Mock dependencies
      userModel.findOne.mockResolvedValue(testUser);
      testUser.comparePassword.mockResolvedValue(true);
      jwt.sign.mockReturnValue('fake-token');

      const token = await authService.login({
        email: 'test@example.com',
        password: 'correctpassword'
      });

      expect(userModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(testUser.comparePassword).toHaveBeenCalledWith('correctpassword');
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: '507f191e810c19729de860ea' },
        'test-secret',
        { expiresIn: '1h' }
      );
      expect(token).toBe('fake-token');
    });

    it('should throw error for invalid email', async () => {
      userModel.findOne.mockResolvedValue(null);
      
      await expect(authService.login({
        email: 'wrong@example.com',
        password: 'password123'
      })).rejects.toThrow('User not found');
    });

    it('should throw error for invalid password', async () => {
      userModel.findOne.mockResolvedValue(testUser);
      testUser.comparePassword.mockResolvedValue(false);
      
      await expect(authService.login({
        email: 'test@example.com',
        password: 'wrongpassword'
      })).rejects.toThrow('Invalid credentials');
    });

    it('should validate required fields', async () => {
      await expect(authService.login({})).rejects.toThrow(
        'Email and password are required'
      );
    });
  });
});