import express from 'express';
import Confirmation from '../models/Confirmation.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET all confirmations
router.get('/', requireAuth('main_admin'), async (req, res) => {
  try {
    const confirmations = await Confirmation.find().sort({ createdAt: -1 });
    res.json(confirmations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new confirmation
router.post('/', async (req, res) => {
  const { name, phone, email } = req.body;

  if (!name || !phone || !email) {
    return res.status(400).json({ message: 'Name, phone, and email are required.' });
  }

  try {
    const newConfirmation = new Confirmation({
      name,
      phone,
      email,
    });

    const savedConfirmation = await newConfirmation.save();
    res.status(201).json(savedConfirmation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
