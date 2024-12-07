import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import pool from '../../../../db';

export async function POST(req) {
  try {
    // Extract Authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    // Verify and decode JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const artistId = decoded.userId; // Assuming JWT contains `userId`

    if (!artistId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }

    // Parse the request body to get the profile image URL
    const { profile_image_url } = await req.json();
    if (!profile_image_url) {
      return NextResponse.json({ error: 'Profile image URL is required' }, { status: 400 });
    }

    // Update the artist's profile image URL in the database
    const updateQuery = `
      UPDATE artists
      SET profile_image_url = $1
      WHERE id = $2
      RETURNING profile_image_url;
    `;
    const { rows } = await pool.query(updateQuery, [profile_image_url, artistId]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    // Return the updated profile image URL as confirmation
    return NextResponse.json({ success: true, profile_image_url: rows[0].profile_image_url }, { status: 200 });
  } catch (error) {
    console.error('Error updating profile image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
