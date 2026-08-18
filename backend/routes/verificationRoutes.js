import express from 'express';
import Verification from '../models/Verification.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/verifications
// @desc    Add a new verification record
router.post('/', requireAuth('main_admin'), async (req, res) => {
  try {
    const { id, name, institute, joinDate, endDate, role, remarks } = req.body;
    
    // Check if ID already exists
    const existing = await Verification.findOne({ id: id.toUpperCase() });
    if (existing) {
      return res.status(400).json({ message: 'Verification ID already exists' });
    }

    const verification = new Verification({
      id: id.toUpperCase(),
      name,
      institute,
      joinDate,
      endDate,
      role,
      remarks
    });

    const createdVerification = await verification.save();
    res.status(201).json(createdVerification);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create verification record', error: error.message });
  }
});

// @route   GET /api/verifications
// @desc    Get all verification records
router.get('/', requireAuth('main_admin'), async (req, res) => {
  try {
    const verifications = await Verification.find({}).sort({ createdAt: -1 });
    res.json(verifications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch verification records' });
  }
});

// @route   GET /api/verifications/:id
// @desc    Get verification by ID
router.get('/:id', async (req, res) => {
  try {
    const verification = await Verification.findOne({ id: req.params.id.toUpperCase() });
    if (verification) {
      res.json(verification);
    } else {
      res.status(404).json({ message: 'Verification record not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch verification record' });
  }
});

// @route   DELETE /api/verifications/:id
// @desc    Delete a verification record by MongoDB _id
router.delete('/:id', requireAuth('main_admin'), async (req, res) => {
  try {
    await Verification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete verification record' });
  }
});

export default router;
