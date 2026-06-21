import mongoose from 'mongoose';

const consultationLeadSchema = new mongoose.Schema({
  name:             { type: String, required: true, trim: true },
  phone:            { type: String, required: true, trim: true },
  businessName:     { type: String, trim: true, default: '' },
  businessCategory: { type: String, trim: true, default: '' },
  city:             { type: String, trim: true, default: '' },
  service:          { type: String, trim: true, default: '' },
  otherService:     { type: String, trim: true, default: '' },
  description:      { type: String, trim: true, default: '' },
}, {
  timestamps: true,
});

export default mongoose.model('ConsultationLead', consultationLeadSchema);
