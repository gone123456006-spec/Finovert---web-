import express from 'express';
import SubAdmin from '../models/SubAdmin.js';
import Internship from '../models/Internship.js';
import { sendEmail, emails } from '../utils/emailService.js';

const router = express.Router();

// Send to individual email
router.post('/send', async (req, res) => {
  try {
    const { to, subject, message } = req.body;
    if (!to || !message) return res.status(400).json({ message: 'Recipient and message required' });

    const { html } = emails.customAdmin(message);
    const result = await sendEmail({ to, subject: subject || 'Message from Finovert Admin', html });

    if (result.success) {
      res.json({ message: `Email sent to ${to}` });
    } else {
      res.status(500).json({ message: 'Email failed to send', error: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Broadcast to all sub-admins with email
router.post('/broadcast/subadmins', async (req, res) => {
  try {
    const { subject, message } = req.body;
    const subAdmins = await SubAdmin.find({ email: { $ne: '' } });
    const { html } = emails.customAdmin(message);

    const results = await Promise.allSettled(
      subAdmins.map(sa => sendEmail({ to: sa.email, subject: subject || 'Message from Finovert Admin', html }))
    );

    const sent = results.filter(r => r.status === 'fulfilled').length;
    res.json({ message: `Broadcast sent to ${sent}/${subAdmins.length} sub-admins` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Broadcast to all intern applicants
router.post('/broadcast/interns', async (req, res) => {
  try {
    const { subject, message } = req.body;
    const interns = await Internship.find({ email: { $ne: '' } });
    const { html } = emails.customAdmin(message);

    const results = await Promise.allSettled(
      interns.map(intern => sendEmail({ to: intern.email, subject: subject || 'Message from Finovert Admin', html }))
    );

    const sent = results.filter(r => r.status === 'fulfilled').length;
    res.json({ message: `Broadcast sent to ${sent}/${interns.length} intern applicants` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Broadcast to everyone (all sub-admins + all interns)
router.post('/broadcast/all', async (req, res) => {
  try {
    const { subject, message } = req.body;
    const subAdmins = await SubAdmin.find({ email: { $ne: '' } });
    const interns = await Internship.find({ email: { $ne: '' } });
    const { html } = emails.customAdmin(message);

    const allEmails = [
      ...subAdmins.map(sa => sa.email),
      ...interns.map(i => i.email),
    ].filter(Boolean);

    const results = await Promise.allSettled(
      allEmails.map(email => sendEmail({ to: email, subject: subject || 'Message from Finovert Admin', html }))
    );

    const sent = results.filter(r => r.status === 'fulfilled').length;
    res.json({ message: `Broadcast sent to ${sent}/${allEmails.length} recipients` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
