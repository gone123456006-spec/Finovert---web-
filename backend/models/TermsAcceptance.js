import mongoose from 'mongoose';

const TermsAcceptanceSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: String, required: true },
  aadhaarNumber: { type: String, required: true },
  pdf: { type: Buffer, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('TermsAcceptance', TermsAcceptanceSchema);
