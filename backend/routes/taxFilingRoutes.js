import express from 'express';
import TaxFilingLead from '../models/TaxFilingLead.js';

const router = express.Router();

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

router.get('/', async (req, res) => {
  try {
    const leads = await TaxFilingLead.find({}).sort({ createdAt: -1 });
    res.json(leads);
  } catch {
    res.status(500).json({ message: 'Failed to fetch tax filing leads.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { pan, email, incomeSources, proceedConfirmed } = req.body;

    if (!pan || !PAN_REGEX.test(String(pan).trim().toUpperCase())) {
      return res.status(400).json({ message: 'Valid PAN card number is required.' });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
      return res.status(400).json({ message: 'Valid email is required.' });
    }
    if (!Array.isArray(incomeSources) || incomeSources.length === 0) {
      return res.status(400).json({ message: 'At least one income source is required.' });
    }

    const lead = new TaxFilingLead({
      pan: String(pan).trim().toUpperCase(),
      email: String(email).trim().toLowerCase(),
      incomeSources,
      proceedConfirmed: Boolean(proceedConfirmed),
      paymentStatus: 'pending',
    });
    const created = await lead.save();
    return res.status(201).json(created);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.post('/:id/complete-payment', async (req, res) => {
  try {
    const lead = await TaxFilingLead.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: 'paid', paidAt: new Date() },
      { new: true },
    );
    if (!lead) return res.status(404).json({ message: 'Tax filing record not found.' });
    return res.json(lead);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await TaxFilingLead.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Record not found.' });
    return res.json({ message: 'Tax filing record deleted.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
