const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['researcher', 'reviewer', 'admin'],
    required: true,
  },
  institution: {
    type: String,
    required: true,
    trim: true,
  },
  department: {
    type: String,
    trim: true,
  },
  profileImage: {
    type: String, // File path or URL
  },
  // Status field for user account
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active',
  },
  // Email verification fields
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: {
    type: String,
  },
  emailVerificationExpires: {
    type: Date,
  },
  // Audit trail fields
  lastModifiedBy: {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    adminName: {
      type: String,
    },
    adminEmail: {
      type: String,
    },
    modifiedAt: {
      type: Date,
      default: Date.now,
    },
    changes: [{
      field: String,
      oldValue: String,
      newValue: String,
      changedAt: {
        type: Date,
        default: Date.now,
      }
    }]
  }
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);


