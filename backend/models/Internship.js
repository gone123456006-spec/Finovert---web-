import mongoose from 'mongoose';

const InternshipSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  collegeName: { type: String, required: true },
  course: { type: String, required: true },
  branch: { type: String, required: true },
  yearOfStudy: { type: String, required: true },
  resumeUrl: { type: String, required: true },
  idProofUrl: { type: String, required: true },
  collegeIdUrl: { type: String, required: true },
  status: { type: String, enum: ['pending', 'selected', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Internship', InternshipSchema);
