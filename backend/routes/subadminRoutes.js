import express from 'express';
import SubAdmin from '../models/SubAdmin.js';
import { sendEmail, emails } from '../utils/emailService.js';
import { hashPassword, verifyPassword, isBcryptHash } from '../utils/password.js';
import { requireAuth, signAdminToken, setAuthCookie } from '../middleware/auth.js';

const router = express.Router();

const SAFE_FIELDS = '-password';

router.post('/request', async (req, res) => {
  try {
    const { name, username, password, email } = req.body;

    if (!name?.trim() || !username?.trim() || !password) {
      return res.status(400).json({ message: 'Name, username, and password are required.' });
    }
    if (String(username).length > 16) {
      return res.status(400).json({ message: 'Username must be max 16 characters.' });
    }
    if (String(password).length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }

    const existing = await SubAdmin.findOne({ username: username.trim() });
    if (existing) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const subAdmin = new SubAdmin({
      name: name.trim(),
      username: username.trim(),
      password: await hashPassword(password),
      email: email?.trim() || '',
      status: 'pending',
    });
    await subAdmin.save();

    if (subAdmin.email) {
      const { subject, html } = emails.internshipReceived(subAdmin.name);
      await sendEmail({
        to: subAdmin.email,
        subject: 'Your Sub-Admin Request Has Been Received – Finovert',
        html: html.replace('Finovert Internship Program', 'Finovert Sub-Admin Portal')
          .replace('application and it is currently under review', 'request and it is currently under review by the Main Admin'),
      });
    }

    res.status(201).json({ message: 'Access requested successfully. Please wait for main admin approval.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to request access' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const subAdmin = await SubAdmin.findOne({ username });

    if (!subAdmin || !(await verifyPassword(password, subAdmin.password))) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    if (subAdmin.status === 'pending') {
      return res.status(403).json({ message: 'Your request is still pending approval from the Main Admin.' });
    }

    if (subAdmin.status === 'rejected') {
      return res.status(403).json({ message: 'Your request for access was rejected.' });
    }

    if (!isBcryptHash(subAdmin.password)) {
      subAdmin.password = await hashPassword(password);
      await subAdmin.save();
    }

    const user = { name: subAdmin.name, username: subAdmin.username, role: 'sub_admin' };
    const token = signAdminToken({ role: 'sub_admin', name: user.name, username: user.username });
    setAuthCookie(res, token);
    res.json({ message: 'Login successful', user, token });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
});

router.get('/requests', requireAuth('main_admin'), async (req, res) => {
  try {
    const requests = await SubAdmin.find({}).select(SAFE_FIELDS);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
});

router.put('/requests/:id', requireAuth('main_admin'), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    const subAdmin = await SubAdmin.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select(SAFE_FIELDS);

    if (subAdmin?.email) {
      if (status === 'approved') {
        const { subject, html } = emails.subAdminApproved(subAdmin.name, subAdmin.username);
        await sendEmail({ to: subAdmin.email, subject, html });
      } else if (status === 'rejected') {
        const { subject, html } = emails.subAdminRejected(subAdmin.name);
        await sendEmail({ to: subAdmin.email, subject, html });
      }
    }

    res.json({ message: `Sub-admin ${status}`, subAdmin });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update request' });
  }
});

router.delete('/requests/:id', requireAuth('main_admin'), async (req, res) => {
  try {
    const subAdmin = await SubAdmin.findByIdAndDelete(req.params.id).select(SAFE_FIELDS);

    if (subAdmin?.email) {
      const { subject, html } = emails.subAdminDeleted(subAdmin.name);
      await sendEmail({ to: subAdmin.email, subject, html });
    }

    res.json({ message: 'Sub-admin deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete sub-admin' });
  }
});

export default router;
