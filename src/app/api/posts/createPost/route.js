import pool from '../../../../db';
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const { user_id, image, description, tags, type } = await req.json();

    // Ensure `tags` is formatted as an array literal
    const formattedTags = `{${tags.join(',')}}`; // Convert array to PostgreSQL array format

    let content_url;

    // Upload the image to Cloudinary
    if (image.startsWith('data:image/')) {
      // Handle base64-encoded image
      const base64Image = image; // Ensure the string has the full base64 format
      const cloudinaryResponse = await cloudinary.v2.uploader.upload(base64Image, {
        folder: 'artverse/posts', // Optional folder to organize uploads
      });
      content_url = cloudinaryResponse.secure_url; // Get the uploaded image URL
    } else if (image.startsWith('http://') || image.startsWith('https://')) {
      // Handle publicly accessible URL
      content_url = image; // Directly use the image URL
    } else {
      throw new Error('Invalid image format. Provide a base64 string or a public URL.');
    }

    // Define the SQL query
    const query = `
      INSERT INTO posts (user_id, content_url, description, tags, type)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    // Use a client to execute the query
    const client = await pool.connect();
    try {
      const result = await client.query(query, [user_id, content_url, description, formattedTags, type]);
      return new Response(JSON.stringify(result.rows[0]), { status: 201 });
    } finally {
      client.release(); // Release the client back to the pool
    }
  } catch (error) {
    console.error('Error in createPost:', error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
