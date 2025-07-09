import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['estudiante', 'profesor', 'coordinador'],
    default: 'estudiante'
  },

  resetPasswordToken: {
    type: String,
    default: null
  },

  resetPasswordExpires: {
    type: Date,
    default: null
  },

  verified: {
    type: Boolean,
    default: false
  },
  verificationToken: String

});

export default mongoose.model('Usuario', userSchema);
