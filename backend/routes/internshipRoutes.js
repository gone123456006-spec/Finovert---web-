import express from 'express';
import Internship from '../models/Internship.js';
import { sendEmail, emails } from '../utils/emailService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const records = await Internship.find().sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const internship = new Internship(req.body);
    const newInternship = await internship.save();

    // Send confirmation email
    if (newInternship.email) {
      const { subject, html } = emails.internshipReceived(newInternship.fullName);
      await sendEmail({ to: newInternship.email, subject, html });
    }

    res.status(201).json(newInternship);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const record = await Internship.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const record = await Internship.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!record) return res.status(404).json({ message: 'Record not found' });

    // Send status email
    if (record.email) {
      if (status === 'selected') {
        const { subject, html } = emails.internshipSelected(record.fullName);
        await sendEmail({ to: record.email, subject, html });
      } else if (status === 'rejected') {
        const { subject, html } = emails.internshipRejected(record.fullName);
        await sendEmail({ to: record.email, subject, html });
      }
    }

    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
