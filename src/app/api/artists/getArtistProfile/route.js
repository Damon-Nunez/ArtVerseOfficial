import pool from '../../../../db';  // Adjust path if needed
import { NextResponse } from 'next/server';

export async function GET(request) {
  // Extract id from query parameters
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ message: 'ID is required.' }, { status: 400 });
  }

  try {
    const query = "SELECT id, name, email, age, dob, bio FROM artists WHERE id = $1";
    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return NextResponse.json({ message: 'Artist not found.' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error fetching artist profile:', error);
    return NextResponse.json({ message: 'Error fetching profile.' }, { status: 500 });
  }
}
