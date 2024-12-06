import cloudinary from 'cloudinary';
import 'dotenv'
// Set up Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload image to Cloudinary
export async function uploadImageToCloudinary(file) {
  return new Promise((resolve, reject) => {
    // Cloudinary accepts streams, so we need to convert the file to a stream
    const stream = cloudinary.v2.uploader.upload_stream(
      {
        folder: 'profile_pictures', // Folder name in Cloudinary to store the images
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);  // Return the result, which contains the URL of the uploaded image
        }
      }
    );

    // Pipe the file stream to Cloudinary
    file.stream().pipe(stream);
  });
}
