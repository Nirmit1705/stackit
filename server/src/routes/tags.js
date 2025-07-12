import express from 'express';
import Tag from '../models/Tag.js';

const router = express.Router();

// @route   GET /api/tags
// @desc    Get all tags
// @access  Public
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const sort = req.query.sort || 'popular'; // popular, alphabetical, newest

    let sortCriteria = {};
    switch (sort) {
      case 'popular':
        sortCriteria = { questionCount: -1 };
        break;
      case 'alphabetical':
        sortCriteria = { name: 1 };
        break;
      case 'newest':
        sortCriteria = { createdAt: -1 };
        break;
      default:
        sortCriteria = { questionCount: -1 };
    }

    const tags = await Tag.find({ isActive: true })
      .select('name description questionCount color')
      .sort(sortCriteria)
      .limit(limit);

    res.json({
      success: true,
      tags: tags.map(tag => tag.name), // Return simple array for compatibility
      fullTags: tags, // Return full tag objects for future use
    });
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tags',
    });
  }
});

// @route   GET /api/tags/popular
// @desc    Get popular tags with usage count
// @access  Public
router.get('/popular', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const popularTags = await Tag.find({ isActive: true, questionCount: { $gt: 0 } })
      .select('name questionCount color')
      .sort({ questionCount: -1 })
      .limit(limit);

    res.json({
      success: true,
      tags: popularTags,
    });
  } catch (error) {
    console.error('Get popular tags error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching popular tags',
    });
  }
});

export default router;
