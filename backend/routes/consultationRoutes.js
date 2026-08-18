import express from 'express';
import mongoose from 'mongoose';
import ConsultationLead from '../models/ConsultationLead.js';
import { sendWhatsApp } from '../utils/whatsappService.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET all inquiries
router.get('/', requireAuth('main_admin'), async (req, res) => {
  try {
    const leads = await ConsultationLead.find({}).sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch inquiries' });
  }
});

// POST new inquiry
router.post('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) {
      return res.status(503).json({ message: 'Database unavailable. Please try again shortly.' });
    }

    const { name, phone, businessName, businessCategory, city, service, otherService, description } = req.body;

    if (!name?.trim() || !phone?.trim()) {
      return res.status(400).json({ message: 'Name and phone are required.' });
    }

    const lead = new ConsultationLead({
      name:             name.trim(),
      phone:            phone.trim(),
      businessName:     businessName?.trim() || '',
      businessCategory: businessCategory?.trim() || '',
      city:             city?.trim() || '',
      service:          service?.trim() || '',
      otherService:     otherService?.trim() || '',
      description:      description?.trim() || '',
    });

    const created = await lead.save();
    return res.status(201).json(created);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// DELETE inquiry
router.delete('/:id', requireAuth('main_admin'), async (req, res) => {
  try {
    const deleted = await ConsultationLead.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Inquiry not found' });
    return res.json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
