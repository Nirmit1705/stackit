import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Answer content is required'],
    minlength: [10, 'Answer must be at least 10 characters long'],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
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
  isAccepted: {
    type: Boolean,
    default: false,
  },
  acceptedAt: {
    type: Date,
  },
  acceptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
answerSchema.index({ question: 1 });
answerSchema.index({ author: 1 });
answerSchema.index({ createdAt: -1 });
answerSchema.index({ voteCount: -1 });
answerSchema.index({ isAccepted: -1 });

// Virtual for calculating vote score
answerSchema.virtual('voteScore').get(function() {
  const upvotes = this.votes.filter(vote => vote.type === 'up').length;
  const downvotes = this.votes.filter(vote => vote.type === 'down').length;
  return upvotes - downvotes;
});

// Middleware to update vote count
answerSchema.pre('save', function(next) {
  if (this.isModified('votes')) {
    const upvotes = this.votes.filter(vote => vote.type === 'up').length;
    const downvotes = this.votes.filter(vote => vote.type === 'down').length;
    this.voteCount = upvotes - downvotes;
  }
  next();
});

// Soft delete
answerSchema.methods.softDelete = function(deletedBy) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.deletedBy = deletedBy;
  return this.save();
};

export default mongoose.model('Answer', answerSchema);
