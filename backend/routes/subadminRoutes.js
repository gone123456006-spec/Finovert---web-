import express from 'express';
import SubAdmin from '../models/SubAdmin.js';
import { sendEmail, emails } from '../utils/emailService.js';

const router = express.Router();

// Request Access / Register SubAdmin
router.post('/request', async (req, res) => {
  try {
    const { name, username, password, email } = req.body;
    
    const existing = await SubAdmin.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const subAdmin = new SubAdmin({ name, username, password, email, status: 'pending' });
    await subAdmin.save();

    // Send confirmation email to the sub-admin if email is provided
    if (email) {
      const { subject, html } = emails.internshipReceived(name); // reuse "received" pattern
      await sendEmail({
        to: email,
        subject: 'Your Sub-Admin Request Has Been Received – Finovert',
        html: html.replace('Finovert Internship Program', 'Finovert Sub-Admin Portal')
             .replace('application and it is currently under review', 'request and it is currently under review by the Main Admin'),
      });
    }

    res.status(201).json({ message: 'Access requested successfully. Please wait for main admin approval.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to request access', error: error.message });
  }
});

// Login SubAdmin
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const subAdmin = await SubAdmin.findOne({ username, password });
    
    if (!subAdmin) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    if (subAdmin.status === 'pending') {
      return res.status(403).json({ message: 'Your request is still pending approval from the Main Admin.' });
    }
    
    if (subAdmin.status === 'rejected') {
      return res.status(403).json({ message: 'Your request for access was rejected.' });
    }

    res.json({ message: 'Login successful', user: { name: subAdmin.name, username: subAdmin.username, role: 'sub_admin' } });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Get All Sub-Admins (Main Admin Only)
router.get('/requests', async (req, res) => {
  try {
    const requests = await SubAdmin.find({});
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
});

// Approve/Reject Request (Main Admin Only)
router.put('/requests/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const subAdmin = await SubAdmin.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (subAdmin?.email) {
      if (status === 'approved') {
        const { subject, html } = emails.subAdminApproved(subAdmin.name, subAdmin.username, subAdmin.password);
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

// Delete Request / SubAdmin (Main Admin Only)
router.delete('/requests/:id', async (req, res) => {
  try {
    const subAdmin = await SubAdmin.findByIdAndDelete(req.params.id);
    
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
