import express from 'express';
import { body, validationResult } from 'express-validator';
import Answer from '../models/Answer.js';
import Question from '../models/Question.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/answers/:id/vote
// @desc    Vote on an answer
// @access  Private
router.post('/:id/vote', [
  authenticate,
  body('type').isIn(['up', 'down']).withMessage('Vote type must be "up" or "down"'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array(),
      });
    }

    const answer = await Answer.findOne({ _id: req.params.id, isDeleted: false })
      .populate('author', 'username');

    if (!answer) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found',
      });
    }

    // Users cannot vote on their own answers
    if (answer.author._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot vote on your own answer',
      });
    }

    const { type } = req.body;
    const userId = req.user._id;

    // Check if user has already voted
    const existingVoteIndex = answer.votes.findIndex(vote => vote.user.toString() === userId.toString());

    if (existingVoteIndex !== -1) {
      const existingVote = answer.votes[existingVoteIndex];
      
      if (existingVote.type === type) {
        // Remove vote if clicking the same vote type
        answer.votes.splice(existingVoteIndex, 1);
      } else {
        // Update vote type
        answer.votes[existingVoteIndex].type = type;
      }
    } else {
      // Add new vote
      answer.votes.push({ user: userId, type });
    }

    await answer.save();

    // Update author's reputation and upvotes count
    const upvotes = answer.votes.filter(vote => vote.type === 'up').length;
    const downvotes = answer.votes.filter(vote => vote.type === 'down').length;
    const newVoteCount = upvotes - downvotes;

    // Update user reputation (simple algorithm: +10 for upvote, -2 for downvote)
    const reputationChange = (upvotes * 10) - (downvotes * 2) - (answer.author.upvotesReceived * 10);
    
    await User.findByIdAndUpdate(answer.author._id, {
      upvotesReceived: upvotes,
      $inc: { reputation: reputationChange }
    });

    // Create notification for answer author if it's an upvote and not from themselves
    if (type === 'up' && existingVoteIndex === -1) {
      await new Notification({
        recipient: answer.author._id,
        sender: req.user._id,
        type: 'vote',
        message: `${req.user.username} upvoted your answer`,
        relatedAnswer: answer._id,
      }).save();
    }

    res.json({
      success: true,
      message: 'Vote recorded successfully',
      voteCount: newVoteCount,
      userVote: existingVoteIndex !== -1 ? answer.votes.find(vote => vote.user.toString() === userId.toString())?.type || null : type,
    });
  } catch (error) {
    console.error('Vote answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while voting',
    });
  }
});

// @route   POST /api/answers/:answerId/accept
// @desc    Accept an answer (only question author can do this)
// @access  Private
router.post('/:answerId/accept', authenticate, async (req, res) => {
  try {
    const answer = await Answer.findOne({ _id: req.params.answerId, isDeleted: false })
      .populate('author', 'username')
      .populate('question');

    if (!answer) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found',
      });
    }

    const question = await Question.findById(answer.question._id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Associated question not found',
      });
    }

    // Only question author can accept answers
    if (question.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the question author can accept answers',
      });
    }

    // Unaccept all other answers for this question
    await Answer.updateMany(
      { question: question._id, isAccepted: true },
      { 
        isAccepted: false,
        $unset: { acceptedAt: 1, acceptedBy: 1 }
      }
    );

    // Toggle acceptance of this answer
    const wasAccepted = answer.isAccepted;
    answer.isAccepted = !wasAccepted;
    
    if (answer.isAccepted) {
      answer.acceptedAt = new Date();
      answer.acceptedBy = req.user._id;
    } else {
      answer.acceptedAt = undefined;
      answer.acceptedBy = undefined;
    }

    await answer.save();

    // Update answer author's reputation (+15 for accepted answer)
    if (answer.isAccepted) {
      await User.findByIdAndUpdate(answer.author._id, {
        $inc: { reputation: 15 }
      });

      // Create notification for answer author
      if (answer.author._id.toString() !== req.user._id.toString()) {
        await new Notification({
          recipient: answer.author._id,
          sender: req.user._id,
          type: 'accept',
          message: `${req.user.username} accepted your answer`,
          relatedQuestion: question._id,
          relatedAnswer: answer._id,
        }).save();
      }
    } else {
      await User.findByIdAndUpdate(answer.author._id, {
        $inc: { reputation: -15 }
      });
    }

    res.json({
      success: true,
      message: answer.isAccepted ? 'Answer accepted successfully' : 'Answer acceptance removed',
      isAccepted: answer.isAccepted,
    });
  } catch (error) {
    console.error('Accept answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while accepting answer',
    });
  }
});

export default router;
