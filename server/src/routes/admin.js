import express from 'express';
import { query, body, validationResult } from 'express-validator';
import User from '../models/User.js';
import Question from '../models/Question.js';
import Answer from '../models/Answer.js';
import Tag from '../models/Tag.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin'));

// @route   GET /api/admin/users
// @desc    Get all users with pagination and search
// @access  Admin
router.get('/users', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().isLength({ max: 100 }).withMessage('Search term too long'),
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

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search;
    const skip = (page - 1) * limit;

    // Build search query
    let query = {};
    if (search) {
      query = {
        $or: [
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const users = await User.find(query)
      .select('username email role status createdAt questionsCount answersCount reputation')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: {
        page,
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        hasNext: page < Math.ceil(totalUsers / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users',
    });
  }
});

// @route   PATCH /api/admin/users/:id/status
// @desc    Block or unblock a user
// @access  Admin
router.patch('/users/:id/status', [
  body('status').isIn(['active', 'blocked']).withMessage('Status must be active or blocked'),
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

    const { status } = req.body;
    const userId = req.params.id;

    // Don't allow blocking other admins
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (targetUser.role === 'admin' && status === 'blocked') {
      return res.status(400).json({
        success: false,
        message: 'Cannot block admin users',
      });
    }

    // Don't allow self-blocking
    if (userId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own status',
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    ).select('username email role status');

    res.json({
      success: true,
      message: `User ${status === 'blocked' ? 'blocked' : 'unblocked'} successfully`,
      user,
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating user status',
    });
  }
});

// @route   GET /api/admin/questions
// @desc    Get all questions including deleted ones
// @access  Admin
router.get('/questions', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('includeDeleted').optional().isBoolean().withMessage('includeDeleted must be boolean'),
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

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const includeDeleted = req.query.includeDeleted === 'true';
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    if (!includeDeleted) {
      query.isDeleted = false;
    }

    const questions = await Question.find(query)
      .populate('author', 'username email')
      .populate('deletedBy', 'username')
      .select('title description tags author voteCount answerCount isDeleted deletedAt deletedBy createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalQuestions = await Question.countDocuments(query);

    res.json({
      success: true,
      questions,
      pagination: {
        page,
        totalPages: Math.ceil(totalQuestions / limit),
        totalQuestions,
        hasNext: page < Math.ceil(totalQuestions / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Get admin questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching questions',
    });
  }
});

// @route   DELETE /api/admin/questions/:id
// @desc    Soft delete a question
// @access  Admin
router.delete('/questions/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    if (question.isDeleted) {
      return res.status(400).json({
        success: false,
        message: 'Question is already deleted',
      });
    }

    await question.softDelete(req.user._id);

    res.json({
      success: true,
      message: 'Question deleted successfully',
    });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting question',
    });
  }
});

// @route   DELETE /api/admin/answers/:id
// @desc    Soft delete an answer
// @access  Admin
router.delete('/answers/:id', async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found',
      });
    }

    if (answer.isDeleted) {
      return res.status(400).json({
        success: false,
        message: 'Answer is already deleted',
      });
    }

    await answer.softDelete(req.user._id);

    // Update question answer count
    await Question.findByIdAndUpdate(answer.question, {
      $pull: { answers: answer._id },
      $inc: { answerCount: -1 }
    });

    res.json({
      success: true,
      message: 'Answer deleted successfully',
    });
  } catch (error) {
    console.error('Delete answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting answer',
    });
  }
});

// @route   GET /api/admin/stats
// @desc    Get platform statistics
// @access  Admin
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      blockedUsers,
      totalQuestions,
      deletedQuestions,
      totalAnswers,
      deletedAnswers,
      totalTags
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: 'active' }),
      User.countDocuments({ status: 'blocked' }),
      Question.countDocuments(),
      Question.countDocuments({ isDeleted: true }),
      Answer.countDocuments(),
      Answer.countDocuments({ isDeleted: true }),
      Tag.countDocuments({ isActive: true })
    ]);

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      recentUsers,
      recentQuestions,
      recentAnswers
    ] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Question.countDocuments({ createdAt: { $gte: thirtyDaysAgo }, isDeleted: false }),
      Answer.countDocuments({ createdAt: { $gte: thirtyDaysAgo }, isDeleted: false })
    ]);

    res.json({
      success: true,
      stats: {
        users: {
          totalUsers,
          activeUsers,
          blockedUsers,
          recentUsers,
        },
        content: {
          totalQuestions,
          activeQuestions: totalQuestions - deletedQuestions,
          deletedQuestions,
          recentQuestions,
          totalAnswers,
          activeAnswers: totalAnswers - deletedAnswers,
          deletedAnswers,
          recentAnswers,
          totalTags,
        },
      },
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics',
    });
  }
});

// @route   POST /api/admin/tags
// @desc    Create a new tag
// @access  Admin
router.post('/tags', [
  body('name')
    .isLength({ min: 2, max: 30 })
    .withMessage('Tag name must be between 2 and 30 characters')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Tag name can only contain lowercase letters, numbers, and hyphens'),
  body('description')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters'),
  body('color')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Color must be a valid hex color code'),
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

    const { name, description, color } = req.body;

    const existingTag = await Tag.findOne({ name: name.toLowerCase() });
    if (existingTag) {
      return res.status(409).json({
        success: false,
        message: 'Tag already exists',
      });
    }

    const tag = new Tag({
      name: name.toLowerCase(),
      description: description || '',
      color: color || '#3B82F6',
      createdBy: req.user._id,
    });

    await tag.save();

    res.status(201).json({
      success: true,
      message: 'Tag created successfully',
      tag,
    });
  } catch (error) {
    console.error('Create tag error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating tag',
    });
  }
});

// @route   DELETE /api/admin/tags/:id
// @desc    Deactivate a tag
// @access  Admin
router.delete('/tags/:id', async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: 'Tag not found',
      });
    }

    tag.isActive = false;
    await tag.save();

    res.json({
      success: true,
      message: 'Tag deactivated successfully',
    });
  } catch (error) {
    console.error('Delete tag error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting tag',
    });
  }
});

export default router;
