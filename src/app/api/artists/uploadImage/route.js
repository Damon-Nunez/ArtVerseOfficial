import multer from 'multer';
import cloudinary from 'cloudinary';
import fs from 'fs';

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Specify where to save uploaded files temporarily
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Generate a unique filename
  },
});

const upload = multer({ storage });

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST route to upload an image
export const POST = async (req, res) => {
  return new Promise((resolve, reject) => {
    // Handle file upload
    upload.single('image')(req, res, async (err) => {
      if (err) {
        console.error('Error in file upload:', err);
        return res.status(400).json({ success: false, message: 'Failed to upload image' });
      }

      // Now you can safely access req.file
      try {
        // Upload the image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);

        // Remove the temporary file
        fs.unlinkSync(req.file.path);

        // Respond with the Cloudinary URL of the uploaded image
        return res.status(200).json({ success: true, url: result.secure_url });
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({ success: false, message: 'Failed to upload image to Cloudinary' });
      }
    });
  });
};
