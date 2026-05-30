import mongoose from 'mongoose';

const InternshipSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  collegeName: { type: String, required: true },
  course: { type: String, required: true },
  branch: { type: String, required: true },
  yearOfStudy: { type: String, required: true },
  preferredRole: { type: String, required: true },
  eligibilityReason: { type: String, default: '' },
  resumeUrl: { type: String, required: true },
  idProofUrl: { type: String, default: '' },
  collegeIdUrl: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'selected', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Internship', InternshipSchema);
