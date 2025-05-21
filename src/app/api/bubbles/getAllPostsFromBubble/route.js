import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import pool from '../../../../db';

export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 403 });
    }

    const artist_id = decoded.userId;

    // Check if artist_id exists
    if (!artist_id) {
      return NextResponse.json({ error: 'Artist ID is missing from token' }, { status: 403 });
    }

    const bubble_id = req.nextUrl.searchParams.get('id');
    if (!bubble_id) {
      return NextResponse.json({ error: 'Bubble ID is required' }, { status: 400 });
    }

    // Query to get all posts from the bubble
    const getPostsFromBubbleQuery = `
      SELECT bp.bubble_id, p.post_id, p.title, p.content_url, p.description, p.created_at
FROM bubble_posts bp
JOIN posts p ON bp.post_id = p.post_id
WHERE bp.bubble_id = $1;
    `;

    const result = await pool.query(getPostsFromBubbleQuery, [bubble_id]);

    if (result.rows.length > 0) {
      return NextResponse.json({ posts: result.rows }, { status: 200 });
    } else {
return NextResponse.json({ posts: [] }, { status: 200 });
    }

  } catch (error) {
    console.error('Error fetching posts from bubble', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
