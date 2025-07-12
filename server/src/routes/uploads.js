import express from 'express';
import busboy from '@fastify/busboy';
import { v2 as cloudinary } from 'cloudinary';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// File upload middleware using busboy
const uploadMiddleware = (req, res, next) => {
  if (req.method !== 'POST') {
    return next();
  }

  const bb = busboy({
    headers: req.headers,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
      files: 1
    }
  });

  let fileBuffer = null;
  let filename = '';
  let mimetype = '';
  let fieldname = '';

  bb.on('file', (name, file, info) => {
    const { filename: fname, mimeType } = info;
    fieldname = name;
    filename = fname;
    mimetype = mimeType;

    // Check file type
    const allowedTypes = /^image\/(jpeg|jpg|png|gif|webp)$/;
    if (!allowedTypes.test(mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Only image files are allowed (JPEG, JPG, PNG, GIF, WebP)',
      });
    }

    const chunks = [];
    file.on('data', (chunk) => {
      chunks.push(chunk);
    });

    file.on('end', () => {
      fileBuffer = Buffer.concat(chunks);
      
      // Check file size
      if (fileBuffer.length > 5 * 1024 * 1024) {
        return res.status(400).json({
          success: false,
          message: 'File too large. Maximum size is 5MB.',
        });
      }
    });
  });

  bb.on('error', (err) => {
    console.error('Busboy error:', err);
    return res.status(400).json({
      success: false,
      message: 'Error processing file upload',
    });
  });

  bb.on('finish', () => {
    if (!fileBuffer) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided',
      });
    }

    req.file = {
      buffer: fileBuffer,
      originalname: filename,
      mimetype: mimetype,
      fieldname: fieldname
    };

    next();
  });

  req.pipe(bb);
};

// @route   POST /api/uploads/image
// @desc    Upload image to Cloudinary
// @access  Private
router.post('/image', authenticate, uploadMiddleware, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided',
      });
    }

    // Upload to Cloudinary using the v2 API
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'stackit',
          transformation: [
            { width: 800, height: 600, crop: 'limit' },
            { quality: 'auto', fetch_format: 'auto' }
          ],
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(req.file.buffer);
    });

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading image',
    });
  }
});

// @route   DELETE /api/uploads/image/:publicId
// @desc    Delete image from Cloudinary
// @access  Private
router.delete('/image/:publicId', authenticate, async (req, res) => {
  try {
    const { publicId } = req.params;

    // Delete from Cloudinary using v2 API
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      res.json({
        success: true,
        message: 'Image deleted successfully',
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Image not found or already deleted',
      });
    }
  } catch (error) {
    console.error('Image delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting image',
    });
  }
});

export default router;
