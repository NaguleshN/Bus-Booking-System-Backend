import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const Register = async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  try {

    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await userModel.create({ name, email, phone, password, role });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return res.status(201).json({ message: 'User created successfully', token });
  } catch (err) {
    console.error('Error:', err); 
    return res.status(500).json({ message: 'Error in user creation' });
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
 
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User does not exist' });
    }

 
    const passMatch = await user.comparePassword(password);
    if (!passMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return res.status(200).json({ message: 'User logged in successfully', token });

    // res.cookie('AuthToken', token, {
    //   httpOnly: true,
    //   maxAge: 3600000, // 1 hour
    //   sameSite: 'strict',
    // });
    // return res.status(200).json({ message: 'User logged in successfully' });
  } catch (err) {
    console.error('Error:', err); // Log the error for debugging
    return res.status(500).json({ message: 'Error in login' });
  }
};

const Logout = async (req, res) => {
  // Clear the AuthToken cookie
  res.clearCookie('AuthToken');
  return res.status(200).json({ message: 'User logged out successfully' });
};

export { Login, Register, Logout };