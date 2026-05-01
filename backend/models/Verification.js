import mongoose from 'mongoose';

const verificationSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  institute: {
    type: String,
    default: "N/A",
  },
  joinDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    default: "Present",
  },
  role: {
    type: String,
    required: true,
  },
  remarks: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
});

const Verification = mongoose.model('Verification', verificationSchema);

export default Verification;
