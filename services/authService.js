import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';

class AuthService {
  
  async register({ name, email, phone, password, role, compName }) {
    
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const userExists = await userModel.findOne({ email });
    const phoneExists = await userModel.findOne({ phone });

    if (userExists) throw new Error('User already exists');
    if (phoneExists) throw new Error('Phone already exists');

   
    const isVerified = role !== 'operator';
    const companyName = role === 'user' ? '' : compName;

    
    return await userModel.create({
      name,
      email,
      phone,
      password,
      role,
      companyName,
      isVerified
    });
  }

  async login({ email, password }) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const user = await userModel.findOne({ email });
    if (!user) throw new Error('User not found');

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) throw new Error('Invalid credentials');

    return jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  }
}

export default AuthService;