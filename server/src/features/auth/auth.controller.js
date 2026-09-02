const authService = require('./auth.service');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'Name is required' },
      });
    }

    if (!email || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({
        success: false,
        error: { message: 'Please provide a valid email address' },
      });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        success: false,
        error: { message: 'Password must be at least 6 characters long' },
      });
    }

    // Check duplicate
    const existing = await authService.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: { message: 'An account with this email already exists' },
      });
    }

    // Create user
    const user = await authService.createUser({ name, email, password });
    const token = authService.generateToken(user);

    res.status(201).json({
      success: true,
      data: {
        user,
        token,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({
        success: false,
        error: { message: 'Please provide a valid email address' },
      });
    }

    if (!password || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        error: { message: 'Password is required' },
      });
    }

    const user = await authService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid email or password' },
      });
    }

    const isValid = await authService.verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid email or password' },
      });
    }

    // Clean user object (remove passwordHash)
    const { passwordHash, ...cleanUser } = user;
    const token = authService.generateToken(cleanUser);

    res.json({
      success: true,
      data: {
        user: cleanUser,
        token,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getMe(req, res, next) {
  try {
    const user = await authService.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' },
      });
    }

    res.json({
      success: true,
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  signup,
  login,
  getMe,
};
