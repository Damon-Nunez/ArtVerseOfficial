import { NextResponse } from 'next/server';
import pool from '../../../../db';
import jwt from 'jsonwebtoken';

export async function POST(req) {
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
            if (!artist_id) {
                return NextResponse.json({ error: 'Artist ID is missing from token' }, { status: 403 });
            }

            const post_id = req.nextUrl.searchParams.get('id');
            if (!post_id) {
                return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
            }

            const { bubble_id } = await req.json();
            if (!bubble_id) {
                return NextResponse.json({ error: 'bubble_id is required' }, { status: 400 });
            }

            // Check if post_id exists in the posts table
            const checkPostQuery = `
                SELECT * FROM posts WHERE post_id = $1
            `;
            const postResults = await pool.query(checkPostQuery, [post_id]);

            if (postResults.rows.length === 0) {
                return NextResponse.json({ message: "This post doesn't exist." }, { status: 400 });
            }

            // Check if bubble_id exists in the bubbles table
            const checkBubbleQuery = `
                SELECT * FROM bubbles WHERE bubble_id = $1
            `;
            const bubbleResults = await pool.query(checkBubbleQuery, [bubble_id]);

            if (bubbleResults.rows.length === 0) {
                return NextResponse.json({ message: "This bubble doesn't exist." }, { status: 400 });
            }

            // Insert the post into the bubble
            const insertPostIntoBubbleQuery = `
                INSERT INTO bubble_posts (bubble_id, post_id)
                VALUES ($1, $2)
                ON CONFLICT (bubble_id, post_id) DO NOTHING;
            `;

            const insertResults = await pool.query(insertPostIntoBubbleQuery, [bubble_id, post_id]);

            if (insertResults.rowCount > 0) {
                return NextResponse.json({ message: 'Post added to bubble successfully' }, { status: 200 });
            } else {
                return NextResponse.json({ message: 'Post already exists in the bubble' }, { status: 409 });
            }

    } catch (error) {
        console.error("Error adding post to bubble:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
