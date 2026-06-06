import express from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import TaxFilingLead from '../models/TaxFilingLead.js';

const router = express.Router();

// ── Razorpay instance (created lazily so missing keys don't crash startup) ────
function getRazorpay() {
  const keyId     = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error('Razorpay keys not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env');
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

// ── POST /api/payments/create-order ───────────────────────────────────────────
// Creates a Razorpay order for a given tax filing. Amount is in paise (₹766 = 76600).
router.post('/create-order', async (req, res) => {
  try {
    const { filingId } = req.body;
    if (!filingId) {
      return res.status(400).json({ message: 'filingId is required.' });
    }

    const lead = await TaxFilingLead.findById(filingId);
    if (!lead) {
      return res.status(404).json({ message: 'Tax filing record not found.' });
    }
    if (lead.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'This filing has already been paid.' });
    }

    const razorpay = getRazorpay();

    const options = {
      amount: 76600,            // ₹766 in paise
      currency: 'INR',
      receipt: `filing_${filingId}`,
      notes: {
        filingId: String(filingId),
        pan:      lead.pan,
        email:    lead.email,
      },
    };

    const order = await razorpay.orders.create(options);

    // Persist the Razorpay order id on the lead for later verification
    lead.razorpayOrderId = order.id;
    await lead.save();

    return res.status(201).json({
      orderId:  order.id,
      amount:   order.amount,
      currency: order.currency,
      keyId:    process.env.RAZORPAY_KEY_ID,
      prefill: {
        email: lead.email,
        name:  lead.pan,          // PAN as placeholder name
      },
    });
  } catch (error) {
    console.error('[Razorpay create-order]', error.message);
    return res.status(500).json({ message: error.message });
  }
});

// ── POST /api/payments/verify ──────────────────────────────────────────────────
// Verifies the Razorpay payment signature and marks the filing as paid.
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, filingId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !filingId) {
      return res.status(400).json({ message: 'Missing payment verification fields.' });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return res.status(500).json({ message: 'Payment configuration error.' });
    }

    // Verify HMAC-SHA256 signature
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment signature verification failed.' });
    }

    // Mark filing as paid
    const lead = await TaxFilingLead.findByIdAndUpdate(
      filingId,
      {
        paymentStatus:      'paid',
        paidAt:             new Date(),
        razorpayPaymentId:  razorpay_payment_id,
        razorpayOrderId:    razorpay_order_id,
      },
      { new: true },
    );

    if (!lead) {
      return res.status(404).json({ message: 'Tax filing record not found.' });
    }

    return res.json({ success: true, lead });
  } catch (error) {
    console.error('[Razorpay verify]', error.message);
    return res.status(500).json({ message: error.message });
  }
});

export default router;
