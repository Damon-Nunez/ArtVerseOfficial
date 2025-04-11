import pool from '../../../../db'; // Adjust path if needed
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const idFromQuery = searchParams.get('id');

    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Authorization token missing or invalid.' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ message: 'Invalid or expired token.' }, { status: 403 });
    }

    const loggedInUserId = decoded.userId;

    // Choose the id: from query if available, otherwise the logged-in user's id
    const targetArtistId = idFromQuery ? parseInt(idFromQuery, 10) : loggedInUserId;

    if (isNaN(targetArtistId)) {
      return NextResponse.json({ message: 'Invalid artist ID.' }, { status: 400 });
    }

    const query = `
      SELECT 
        artists.artist_id, 
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
      LEFT JOIN followers ON artists.artist_id = followers.followed_id
      LEFT JOIN followers AS following ON artists.artist_id = following.follower_id
      WHERE artists.artist_id = $1
      GROUP BY artists.artist_id
    `;

    const { rows } = await pool.query(query, [targetArtistId]);

    if (rows.length === 0) {
      return NextResponse.json({ message: 'Artist not found.' }, { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('Error fetching artist profile:', error);
    return NextResponse.json({ message: 'Error fetching profile.' }, { status: 500 });
  }
}

