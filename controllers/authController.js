import AuthService from '../services/authService.js';

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  register = async (req, res) => {
    try {
      const user = await this.authService.register(req.body);
      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user
      });
    } catch (error) {
      const status = error.message.includes('already exists') ? 400 : 500;
      return res.status(status).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  };

  login = async (req, res) => {
    try {
      const data = await this.authService.login(req.body);
      const { token, user } = data;
      
      res.cookie('AuthToken', token, {
        httpOnly: true,
        maxAge: 3600000,
        sameSite: 'strict'
      });
      res.setHeader('Authorization', `Bearer ${token}`);
      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: { token, user}
      });
    } catch (error) {
      const status = error.message.includes('Invalid') ? 401 : 400;
      return res.status(status).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  };

  logout = (req, res) => {
    try {
      res.clearCookie('AuthToken');
      return res.status(200).json({
        success: true,
        message: "Logged out successfully",
        data: null
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Logout failed",
        data: null
      });
    }
  };
}

export default AuthController;
