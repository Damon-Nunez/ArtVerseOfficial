import { NextResponse } from 'next/server';
import pool from '../../../../db';
import jwt from 'jsonwebtoken';

export async function POST(req) {
    try {

        const insertCommentQuery =
        `
      INSERT INTO comments (artist_id, post_id, comment_text) 
VALUES ($1, $2, $3)
        `;
          //Authorization Code. This code decodes the token you put in and designates it as artist_id to know whos using this route
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


          //Designates the meaning of the number we put as a parameter
        const post_id = req.nextUrl.searchParams.get('id');
        
        if (!post_id) {
            return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
        }
        
        //Checks the PostQuery to see if the post exists
        const checkPostQuery = 
        `SELECT * FROM posts
        WHERE post_id = $1
        `; 

        const results = await pool.query(checkPostQuery, [post_id])

        if(results.rows.length === 0) {
            return NextResponse.json({ message: 'The post does not exist.'}, {status:404})
        }

        const {comment_text} = await req.json()

        if(!comment_text) {
            return NextResponse.json({error: "Comment text required"}, {status:400});
        }

       const result = await pool.query(insertCommentQuery, [
            artist_id,
            post_id,
            comment_text
        ])

        if (result.rowCount > 0) {
            return NextResponse.json({ message: 'Comment added successfully', comment: result.rows[0] }, { status: 201 });
        } else {
            return NextResponse.json({ message: 'Failed to add comment' }, { status: 500 });
        }


    }catch(error) {
        console.error("Error adding comment", error);
        return NextResponse.json({ error:"Internal server error"}, {status:500});
    }
}