import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tag name is required'],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [2, 'Tag name must be at least 2 characters long'],
    maxlength: [30, 'Tag name cannot exceed 30 characters'],
    match: [/^[a-z0-9-]+$/, 'Tag name can only contain lowercase letters, numbers, and hyphens'],
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot exceed 200 characters'],
    default: '',
  },
  questionCount: {
    type: Number,
    default: 0,
  },
  color: {
    type: String,
    default: '#3B82F6', // Default blue color
    match: [/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color code'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Indexes for performance
tagSchema.index({ name: 1 });
tagSchema.index({ questionCount: -1 });
tagSchema.index({ isActive: 1 });

export default mongoose.model('Tag', tagSchema);
