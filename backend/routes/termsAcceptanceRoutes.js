import express from 'express';
import TermsAcceptance from '../models/TermsAcceptance.js';
import { generateTermsPdf } from '../utils/termsPdf.js';
import { waitForMongo } from '../utils/waitForMongo.js';
import { sendEmail, emails } from '../utils/emailService.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;
const AADHAAR_REGEX = /^\d{12}$/;
const DATA_URL_REGEX = /^data:image\/(png|jpeg|jpg|webp);base64,/i;

function isDataUrl(value) {
  return typeof value === 'string' && DATA_URL_REGEX.test(value) && value.length > 40 && value.length < 8_000_000;
}

router.get('/', requireAuth('main_admin'), async (req, res) => {
  try {
    const records = await TermsAcceptance.find()
      .select('fullName email phone date aadhaarNumber createdAt')
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id/pdf', requireAuth('main_admin'), async (req, res) => {
  try {
    const record = await TermsAcceptance.findById(req.params.id).select('pdf fullName');
    if (!record?.pdf) return res.status(404).json({ message: 'PDF not found' });

    const filename = `${String(record.fullName || 'intern').replace(/[^\w.-]+/g, '_')}_internship_terms.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    res.send(record.pdf);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const dbReady = await waitForMongo(12000);
    if (!dbReady) {
      return res.status(503).json({ message: 'Database unavailable. Please try again shortly.' });
    }

    const fullName = String(req.body.fullName || '').trim();
    const email = String(req.body.email || '').trim();
    const phone = String(req.body.phone || '').replace(/\D/g, '');
    const date = String(req.body.date || '').trim();
    const aadhaarNumber = String(req.body.aadhaarNumber || '').replace(/\D/g, '');
    const signature = String(req.body.signature || '');
    const facePhoto = String(req.body.facePhoto || '');

    if (!fullName || !email || !phone || !date || !aadhaarNumber || !signature || !facePhoto) {
      return res.status(400).json({ message: 'Please complete all required fields, signature, and face verification.' });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: 'Enter a valid email address.' });
    }
    if (!INDIAN_MOBILE_REGEX.test(phone)) {
      return res.status(400).json({ message: 'Enter a valid 10-digit Indian mobile number.' });
    }
    if (!AADHAAR_REGEX.test(aadhaarNumber)) {
      return res.status(400).json({ message: 'Enter a valid 12-digit Aadhaar number.' });
    }
    if (!isDataUrl(signature) || !isDataUrl(facePhoto)) {
      return res.status(400).json({ message: 'Signature and face verification are required.' });
    }

    const pdf = await generateTermsPdf({
      fullName,
      email,
      phone,
      date,
      aadhaarNumber,
      signature,
      facePhoto,
    });

    const saved = await TermsAcceptance.create({
      fullName,
      email,
      phone,
      date,
      aadhaarNumber,
      pdf,
    });

    res.status(201).json({
      id: saved._id,
      message: 'Terms accepted and saved.',
    });

    const { subject, html, attachments } = emails.termsOnboarded({
      fullName,
      email,
      phone,
      date,
      aadhaarNumber,
      facePhoto,
      signature,
    });
    void sendEmail({ to: email, subject, html, attachments });
  } catch (error) {
    console.error('[terms-acceptances]', error);
    res.status(400).json({ message: error.message || 'Failed to save terms acceptance.' });
  }
});

router.delete('/:id', requireAuth('main_admin'), async (req, res) => {
  try {
    const record = await TermsAcceptance.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
