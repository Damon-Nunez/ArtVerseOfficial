import { NextResponse } from 'next/server';
import pool from '../../../../db';

export const GET = async (req) => {
  try {
    const post_id = req.nextUrl.searchParams.get('id');

    if (!post_id) {
      return NextResponse.json({ error: "Post Id is required" }, { status: 400 });
    }

    // Check if the post exists
    const checkPostQuery = `SELECT * FROM posts WHERE post_id = $1`;
    const results = await pool.query(checkPostQuery, [post_id]);

    if (results.rows.length === 0) {
      return NextResponse.json({ message: 'The post does not exist.' }, { status: 404 });
    }

    // Count the number of likes for the post
    const countLikesQuery = `SELECT COUNT(*) FROM likes WHERE post_id = $1`;
    const countResult = await pool.query(countLikesQuery, [post_id]);

    // Get the like count as a number
    const likeCount = parseInt(countResult.rows[0].count, 10); // Ensure the result is a number

    // If no likes, return 0
    return NextResponse.json(likeCount, { status: 200 });

  } catch (error) {
    console.error("Error counting likes", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
