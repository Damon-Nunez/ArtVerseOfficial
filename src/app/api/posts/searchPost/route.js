import { NextResponse } from 'next/server';
import pool from '../../../../db';
import jwt from 'jsonwebtoken';

export async function GET(req) {
  try {
    // Step 1: Auth
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const artist_id = decoded.userId;

    // Step 2: Grab query param
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json({ error: 'Missing query' }, { status: 400 });
    }

    // Step 3: SQL magic (you write this part 💥)
    const searchQuery = `
      SELECT * FROM posts
      WHERE LOWER(title) LIKE LOWER($1)
      OR EXISTS (
        SELECT 1 FROM unnest(tags) tag
        WHERE LOWER(tag) LIKE LOWER($1)
      )
      ORDER BY created_at DESC
    `;

    const values = [`%${query}%`];

    const result = await pool.query(searchQuery, values);
    return NextResponse.json({ posts: result.rows }, { status: 200 });

  } catch (err) {
    console.error('Error searching posts:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
