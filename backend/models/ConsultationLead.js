import mongoose from 'mongoose';

const consultationLeadSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  contact: { type: String, required: true, trim: true },
  businessType: { type: String, required: true, trim: true },
}, {
  timestamps: true,
});

export default mongoose.model('ConsultationLead', consultationLeadSchema);
