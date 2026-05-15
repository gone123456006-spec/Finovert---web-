import express from 'express';
import ConsultationLead from '../models/ConsultationLead.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const leads = await ConsultationLead.find({}).sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch consultation leads' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, contact, businessType } = req.body;
    if (!name || !contact || !businessType) {
      return res.status(400).json({ message: 'Name, contact and business type are required.' });
    }

    const lead = new ConsultationLead({ name, contact, businessType });
    const created = await lead.save();
    return res.status(201).json(created);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await ConsultationLead.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Lead not found' });
    return res.json({ message: 'Consultation lead deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
