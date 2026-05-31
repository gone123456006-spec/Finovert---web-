import express from 'express';
import mongoose from 'mongoose';
import Internship from '../models/Internship.js';
import { sendEmail, emails } from '../utils/emailService.js';

const router = express.Router();

const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

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
    if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) {
      return res.status(503).json({ message: 'Database unavailable. Please try again shortly.' });
    }

    const phone = String(req.body.phone || '').replace(/\D/g, '');
    if (!INDIAN_MOBILE_REGEX.test(phone)) {
      return res.status(400).json({
        message: 'Enter a valid 10-digit Indian mobile number (starts with 6, 7, 8, or 9).',
      });
    }

    const {
      fullName,
      email,
      collegeName,
      course,
      branch,
      yearOfStudy,
      preferredRole,
      eligibilityReason = '',
      resumeUrl,
      idProofUrl = '',
      collegeIdUrl = '',
    } = req.body;

    if (!fullName?.trim() || !email?.trim() || !collegeName?.trim() || !course?.trim() || !branch?.trim() || !yearOfStudy?.trim() || !preferredRole?.trim() || !resumeUrl?.trim()) {
      return res.status(400).json({ message: 'Please fill in all required fields and upload your resume.' });
    }

    const internship = new Internship({
      fullName: fullName.trim(),
      phone,
      email: email.trim(),
      collegeName: collegeName.trim(),
      course: course.trim(),
      branch: branch.trim(),
      yearOfStudy: yearOfStudy.trim(),
      preferredRole: preferredRole.trim(),
      eligibilityReason: String(eligibilityReason || '').trim(),
      resumeUrl: resumeUrl.trim(),
      idProofUrl: String(idProofUrl || '').trim(),
      collegeIdUrl: String(collegeIdUrl || '').trim(),
    });
    const newInternship = await internship.save();

    // Respond immediately; send confirmation email in the background.
    res.status(201).json(newInternship);

    if (newInternship.email) {
      const { subject, html } = emails.internshipReceived(newInternship.fullName);
      void sendEmail({ to: newInternship.email, subject, html });
    }
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
