import express from 'express';
import { body, query, validationResult } from 'express-validator';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import Question from '../models/Question.js';
import Answer from '../models/Answer.js';
import User from '../models/User.js';
import Tag from '../models/Tag.js';
import Notification from '../models/Notification.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Initialize DOMPurify with jsdom
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// Configure DOMPurify options
const purifyOptions = {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre', 'a', 'img'],
  ALLOWED_ATTR: ['href', 'target', 'src', 'alt', 'width', 'height', 'class'],
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  SANITIZE_DOM: true,
  KEEP_CONTENT: true
};

// Sanitize HTML content
const sanitizeContent = (content) => {
  return DOMPurify.sanitize(content, purifyOptions);
};

// @route   GET /api/questions
// @desc    Get all questions with pagination and filtering
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('sort').optional().isIn(['newest', 'unanswered', 'votes']).withMessage('Invalid sort option'),
], optionalAuth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array(),
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || 'newest';
    const tags = req.query.tags ? req.query.tags.split(',') : null;
    const search = req.query.search;

    const skip = (page - 1) * limit;

    // Build query
    let query = { isDeleted: false };

    if (tags && tags.length > 0) {
      query.tags = { $in: tags };
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Build sort criteria
    let sortCriteria = {};
    switch (sort) {
      case 'newest':
        sortCriteria = { createdAt: -1 };
        break;
      case 'unanswered':
        query.answerCount = 0;
        sortCriteria = { createdAt: -1 };
        break;
      case 'votes':
        sortCriteria = { voteCount: -1, createdAt: -1 };
        break;
      default:
        sortCriteria = { createdAt: -1 };
    }

    // Execute query
    const questions = await Question.find(query)
      .populate('author', 'username avatarUrl')
      .select('title description tags author voteCount answerCount createdAt')
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const totalQuestions = await Question.countDocuments(query);
    const totalPages = Math.ceil(totalQuestions / limit);

    res.json({
      success: true,
      questions: questions.map(question => ({
        _id: question._id,
        title: question.title,
        description: question.description.substring(0, 200) + '...',
        tags: question.tags,
        author: {
          username: question.author.username,
          avatarUrl: question.author.avatarUrl,
        },
        voteCount: question.voteCount,
        answerCount: question.answerCount,
        createdAt: question.createdAt,
      })),
      pagination: {
        page,
        totalPages,
        totalQuestions,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching questions',
    });
  }
});

// @route   GET /api/questions/:id
// @desc    Get a single question with answers
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const question = await Question.findOne({ _id: req.params.id, isDeleted: false })
      .populate('author', 'username avatarUrl')
      .populate({
        path: 'answers',
        match: { isDeleted: false },
        populate: {
          path: 'author',
          select: 'username avatarUrl'
        },
        options: { sort: { isAccepted: -1, voteCount: -1, createdAt: 1 } }
      });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    // Increment view count
    question.viewCount += 1;
    await question.save();

    // Add user vote information if authenticated
    const questionData = question.toObject();
    if (req.user) {
      const userVote = question.votes.find(vote => vote.user.toString() === req.user._id.toString());
      questionData.userVote = userVote ? userVote.type : null;

      // Add user vote information for answers
      questionData.answers = questionData.answers.map(answer => {
        const userVote = answer.votes.find(vote => vote.user.toString() === req.user._id.toString());
        return {
          ...answer,
          userVote: userVote ? userVote.type : null,
        };
      });
    }

    res.json({
      success: true,
      question: questionData,
    });
  } catch (error) {
    console.error('Get question error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching question',
    });
  }
});

// @route   POST /api/questions
// @desc    Create a new question
// @access  Private
router.post('/', [
  authenticate,
  body('title')
    .isLength({ min: 10, max: 200 })
    .withMessage('Title must be between 10 and 200 characters'),
  body('description')
    .isLength({ min: 20 })
    .withMessage('Description must be at least 20 characters'),
  body('tags')
    .isArray({ min: 1, max: 5 })
    .withMessage('You must provide 1-5 tags'),
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

    const { title, description, tags } = req.body;

    // Sanitize HTML content using DOMPurify
    const sanitizedDescription = sanitizeContent(description);

    // Validate and normalize tags
    const normalizedTags = tags.map(tag => tag.toLowerCase().trim()).filter(tag => tag.length > 0);

    if (normalizedTags.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one valid tag is required',
      });
    }

    // Create question
    const question = new Question({
      title: title.trim(),
      description: sanitizedDescription,
      tags: normalizedTags,
      author: req.user._id,
    });

    await question.save();

    // Update user question count
    await User.findByIdAndUpdate(req.user._id, { $inc: { questionsCount: 1 } });

    // Update tag counts
    for (const tagName of normalizedTags) {
      await Tag.findOneAndUpdate(
        { name: tagName },
        { $inc: { questionCount: 1 } },
        { upsert: true, new: true }
      );
    }

    // Populate author information
    await question.populate('author', 'username avatarUrl');

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      question,
    });
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating question',
    });
  }
});

// @route   POST /api/questions/:id/answers
// @desc    Add an answer to a question
// @access  Private
router.post('/:id/answers', [
  authenticate,
  body('content')
    .isLength({ min: 10 })
    .withMessage('Answer content must be at least 10 characters'),
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

    const question = await Question.findOne({ _id: req.params.id, isDeleted: false });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    const { content } = req.body;

    // Sanitize HTML content using DOMPurify
    const sanitizedContent = sanitizeContent(content);

    // Create answer
    const answer = new Answer({
      content: sanitizedContent,
      author: req.user._id,
      question: question._id,
    });

    await answer.save();

    // Update question
    question.answers.push(answer._id);
    question.answerCount += 1;
    await question.save();

    // Update user answer count
    await User.findByIdAndUpdate(req.user._id, { $inc: { answersCount: 1 } });

    // Create notification for question author
    if (question.author.toString() !== req.user._id.toString()) {
      await new Notification({
        recipient: question.author,
        sender: req.user._id,
        type: 'answer',
        message: `${req.user.username} answered your question "${question.title}"`,
        relatedQuestion: question._id,
        relatedAnswer: answer._id,
      }).save();
    }

    // Populate author information
    await answer.populate('author', 'username avatarUrl');

    res.status(201).json({
      success: true,
      message: 'Answer added successfully',
      answer,
    });
  } catch (error) {
    console.error('Create answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating answer',
    });
  }
});

export default router;
