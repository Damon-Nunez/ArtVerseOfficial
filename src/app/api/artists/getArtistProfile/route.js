import pool from '../../../../db'; // Adjust path if needed
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Authorization token missing or invalid.' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure JWT_SECRET is set in .env
    } catch (error) {
      return NextResponse.json({ message: 'Invalid or expired token.' }, { status: 403 });
    }

    // Extract user ID from the decoded token
    const userId = decoded.userId;

    // Query database for the user profile, including follower, following counts, and social media links
    const query = `
      SELECT 
        artists.id, 
        artists.name, 
        artists.email, 
        artists.age, 
        artists.dob, 
        artists.bio, 
        artists.profile_image_url,
        artists.twitter_link, 
        artists.instagram_link, 
        artists.youtube_link,
        COUNT(DISTINCT followers.follower_id) AS followers_count,
        COUNT(DISTINCT following.followed_id) AS following_count
      FROM artists
      LEFT JOIN followers ON artists.id = followers.followed_id
      LEFT JOIN followers AS following ON artists.id = following.follower_id
      WHERE artists.id = $1
      GROUP BY artists.id
    `;

    const { rows } = await pool.query(query, [userId]);

    if (rows.length === 0) {
      return NextResponse.json({ message: 'Artist not found.' }, { status: 404 });
    }

    // Return the artist profile data, including social media links
    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('Error fetching artist profile:', error);
    return NextResponse.json({ message: 'Error fetching profile.' }, { status: 500 });
  }
}
