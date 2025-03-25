import AuthService from '../services/authService.js';

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  register = async (req, res) => {
    try {
      const user = await this.authService.register(req.body);
      res.status(201).json(user);
    } catch (error) {
      const status = error.message.includes('already exists') ? 400 : 500;
      res.status(status).json({ error: error.message });
    }
  };

  login = async (req, res) => {
    try {
      const token = await this.authService.login(req.body);
      res.cookie('AuthToken', token, {
        httpOnly: true,
        maxAge: 3600000,
        sameSite: 'strict'
      });
      res.setHeader('Authorization', `Bearer ${token}`);
      res.json({ token });
    } catch (error) {
      const status = error.message.includes('Invalid') ? 401 : 400;
      res.status(status).json({ error: error.message });
    }
  };

  logout = (req, res) => {
    res.clearCookie('AuthToken');
    res.status(200).json({ message: 'Logged out successfully' });
  };
}

export default AuthController;