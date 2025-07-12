import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Question title is required'],
    trim: true,
    minlength: [10, 'Title must be at least 10 characters long'],
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Question description is required'],
    minlength: [20, 'Description must be at least 20 characters long'],
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [30, 'Tag cannot exceed 30 characters'],
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  answers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer',
  }],
  votes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['up', 'down'],
      required: true,
    },
  }],
  voteCount: {
    type: Number,
    default: 0,
  },
  answerCount: {
    type: Number,
    default: 0,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Indexes for performance
questionSchema.index({ author: 1 });
questionSchema.index({ tags: 1 });
questionSchema.index({ createdAt: -1 });
questionSchema.index({ voteCount: -1 });
questionSchema.index({ answerCount: 1 });
questionSchema.index({ title: 'text', description: 'text' });

// Virtual for calculating vote score
questionSchema.virtual('voteScore').get(function() {
  const upvotes = this.votes.filter(vote => vote.type === 'up').length;
  const downvotes = this.votes.filter(vote => vote.type === 'down').length;
  return upvotes - downvotes;
});

// Middleware to update vote count
questionSchema.pre('save', function(next) {
  if (this.isModified('votes')) {
    const upvotes = this.votes.filter(vote => vote.type === 'up').length;
    const downvotes = this.votes.filter(vote => vote.type === 'down').length;
    this.voteCount = upvotes - downvotes;
  }
  next();
});

// Soft delete
questionSchema.methods.softDelete = function(deletedBy) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.deletedBy = deletedBy;
  return this.save();
};

export default mongoose.model('Question', questionSchema);
