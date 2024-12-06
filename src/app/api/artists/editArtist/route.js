import { NextResponse } from 'next/server';
import cloudinary from 'cloudinary';
import pool from '../../../../db';

// Initialize Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    // Parse incoming form data
    const formData = await req.formData();
    const file = formData.get('file'); // The uploaded file
    const artistId = formData.get('artistId'); // Artist ID from the form data

    if (!file || !artistId) {
      return NextResponse.json({ error: 'File and artist ID are required.' }, { status: 400 });
    }

    // Upload file to Cloudinary
    const uploadResponse = await cloudinary.v2.uploader.upload(file, {
      folder: 'ArtVerseImages',
    });

    const imageUrl = uploadResponse.secure_url;

    // Update the database with the new profile image URL
    const updateArtistQuery = `
      UPDATE artists
      SET profile_image_url = $1
      WHERE id = $2
      RETURNING profile_image_url;
    `;

    const { rows } = await pool.query(updateArtistQuery, [imageUrl, artistId]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Artist not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, url: rows[0].profile_image_url }, { status: 200 });
  } catch (error) {
    console.error('Error handling profile image upload:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
