import express from 'express';

const router = express.Router();

/**
 * @route   POST /api/auth/main-login
 * @desc    Authenticate the Main Admin using a backend password
 * @access  Public
 */
router.post('/main-login', (req, res) => {
  try {
    const { password } = req.body;
    
    // We get the password from the environment variable for security.
    // This way, it is never hardcoded in the frontend or version control.
    const adminPassword = process.env.ADMIN_PASSWORD || 'Ar@v1234';

    if (password === adminPassword) {
      res.json({ 
        message: 'Login successful', 
        role: 'main_admin', 
        user: { name: 'Main Admin', username: 'admin' } 
      });
    } else {
      res.status(401).json({ message: 'Incorrect password. Access denied.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Authentication error', error: error.message });
  }
});

export default router;
