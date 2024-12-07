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

    // Query database for the user profile, including the profile image URL
    const query = "SELECT id, name, email, age, dob, bio, profile_image_url FROM artists WHERE id = $1";
    const { rows } = await pool.query(query, [userId]);

    if (rows.length === 0) {
      return NextResponse.json({ message: 'Artist not found.' }, { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('Error fetching artist profile:', error);
    return NextResponse.json({ message: 'Error fetching profile.' }, { status: 500 });
  }
}
