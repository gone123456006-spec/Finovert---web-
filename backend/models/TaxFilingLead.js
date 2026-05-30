import mongoose from 'mongoose';

const taxFilingLeadSchema = new mongoose.Schema(
  {
    pan: { type: String, required: true, trim: true, uppercase: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    incomeSources: { type: [String], required: true, default: [] },
    planName: { type: String, default: 'Assisted Salary Plan' },
    basePrice: { type: Number, default: 649 },
    gstAmount: { type: Number, default: 117 },
    totalAmount: { type: Number, default: 766 },
    proceedConfirmed: { type: Boolean, default: false },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
    },
    paidAt: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.model('TaxFilingLead', taxFilingLeadSchema);
