import express from 'express';
import { requireAuth, signAdminToken, setAuthCookie, clearAuthCookie } from '../middleware/auth.js';

const router = express.Router();

function getAdminPassword() {
  // Keep the existing password. Do not force a new env var or lock the owner out.
  return process.env.ADMIN_PASSWORD || 'Ar@v1234';
}

router.post('/main-login', (req, res) => {
  try {
    const { password } = req.body;
    const adminPassword = getAdminPassword();

    if (!adminPassword) {
      return res.status(500).json({ message: 'Admin password is not configured on the server.' });
    }

    if (!password || password !== adminPassword) {
      return res.status(401).json({ message: 'Incorrect password. Access denied.' });
    }

    const user = { name: 'Main Admin', username: 'admin' };
    const token = signAdminToken({ role: 'main_admin', ...user });
    setAuthCookie(res, token);
    res.json({ message: 'Login successful', role: 'main_admin', user, token });
  } catch (error) {
    res.status(500).json({ message: 'Authentication error' });
  }
});

router.get('/me', requireAuth('main_admin', 'sub_admin'), (req, res) => {
  res.json({
    role: req.admin.role,
    user: { name: req.admin.name, username: req.admin.username },
  });
});

router.post('/logout', (req, res) => {
  clearAuthCookie(res);
  res.json({ message: 'Logged out' });
});

export default router;
