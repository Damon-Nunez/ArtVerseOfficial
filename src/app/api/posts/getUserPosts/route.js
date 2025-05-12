import { NextResponse } from 'next/server';
import pool from '../../../../db';
import jwt from 'jsonwebtoken';

export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.userId;


    const query = `
  SELECT * FROM posts
  WHERE user_id = $1
  ORDER BY created_at DESC;
`;

    const { rows } = await pool.query(query, [user_id]);

    return NextResponse.json({ posts: rows });

  } catch (error) {
    console.error('Error fetching user posts:', error);
    return NextResponse.json({ error: 'Failed to fetch user posts' }, { status: 500 });
  }
}
