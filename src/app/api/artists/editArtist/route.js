import { IncomingForm } from 'formidable';
import { NextResponse } from 'next/server';
import cloudinary from 'cloudinary';
import pool from '../../../../db'; // Path to your DB connection

// Initialize Cloudinary
cloudinary.config({
  cloud_name: 'dxdiv4gim', // Replace with your Cloudinary cloud name
  api_key: '334746135729688', // Replace with your Cloudinary API key
  api_secret: 'B0hi8X0ekfD3rBY0DGo4uOLtg8w', // Replace with your Cloudinary API secret
});

// Handle the POST request for image upload
export async function POST(req) {
  // Initialize formidable form handler
  const form = new IncomingForm();

  // Return a promise because formidable uses callbacks for parsing
  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form:", err);
        return resolve(NextResponse.json({ error: 'Image upload failed' }, { status: 500 }));
      }

      // Access the uploaded file (assuming it's under the 'file' field)
      const uploadedFile = files.file[0];

      // Upload the image to Cloudinary
      try {
        const uploadResponse = await cloudinary.v2.uploader.upload(uploadedFile.filepath, {
          folder: 'ArtVerseImages', // Optionally, specify a folder for your images
        });

        // Get the image URL from Cloudinary response
        const imageUrl = uploadResponse.secure_url;

        // Now update the artist's profile image URL in the database
        const { artistId, profile_image_url } = fields; // Get artistId and the new profile_image_url from form data

        const updateArtist = `
          UPDATE artists
          SET profile_image_url = $1
          WHERE id = $2
        `;

        // Update the database with the new image URL
        await pool.query(updateArtist, [imageUrl, artistId]);

        // Return the updated image URL as a response
        return resolve(NextResponse.json({ url: imageUrl }, { status: 200 }));
      } catch (uploadError) {
        console.error("Cloudinary upload failed:", uploadError);
        return resolve(NextResponse.json({ error: 'Image upload failed' }, { status: 500 }));
      }
    });
  });
}
