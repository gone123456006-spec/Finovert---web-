import mongoose from 'mongoose';

const subAdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 1,
    maxlength: 16
  },
  email: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

export default mongoose.model('SubAdmin', subAdminSchema);
