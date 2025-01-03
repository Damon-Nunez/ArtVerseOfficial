import pool from '../../../../db';
import cloudinary from 'cloudinary';
import jwt from 'jsonwebtoken';

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    // Check if the Authorization header contains the token
    const authHeader = req.headers.get('Authorization');
    console.log('Authorization Header:', authHeader);  // Log to see the token
    
    if (!authHeader) {
      throw new Error('Authorization header missing');
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Extracted Token:', token);  // Log the token
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Decode the token
    console.log('Decoded Token:', decoded);  // Log the decoded token
    const user_id = decoded.userId;  // Use `userId` from the decoded token

    // Log the user_id to ensure it's being extracted
    console.log('user_id:', user_id);

    // Check for missing fields in the request
    const { image, description, tags, type } = await req.json();

    if (!image) {
      throw new Error('Image is required');
    }

    // Ensure tags is formatted properly
    const formattedTags = tags ? `{${tags.join(',')}}` : null;

    let content_url;

    // Upload the image to Cloudinary
    if (image.startsWith('data:image/')) {
      const cloudinaryResponse = await cloudinary.v2.uploader.upload(image, {
        folder: 'artverse/posts',
      });
      content_url = cloudinaryResponse.secure_url;
    } else if (image.startsWith('http://') || image.startsWith('https://')) {
      content_url = image;
    } else {
      throw new Error('Invalid image format. Provide a base64 string or a public URL.');
    }

    const query = `
      INSERT INTO posts (user_id, content_url, description, tags, type)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const client = await pool.connect();
    try {
      const result = await client.query(query, [user_id, content_url, description || null, formattedTags, type || 'public']);
      return new Response(JSON.stringify(result.rows[0]), { status: 201 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error in createPost:', error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
