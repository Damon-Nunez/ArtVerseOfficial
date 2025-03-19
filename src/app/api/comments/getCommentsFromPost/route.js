import { NextResponse } from 'next/server';
import pool from '../../../../db';
import jwt from 'jsonwebtoken';

export const GET = async(req) => {
    try {

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

              const post_id = req.nextUrl.searchParams.get('id');
        
              if (!post_id) {
                  return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
              }


              const checkPostQuery = 
              `SELECT * FROM posts
              WHERE post_id = $1
              `; 
      
              const results = await pool.query(checkPostQuery, [post_id])
      
              if(results.rows.length === 0) {
                  return NextResponse.json({ message: 'The post does not exist.'}, {status:404})
              }

              const getCommentDetailsQuery = `
              SELECT comments.comment_id, comments.comment_text, artists.name, artists.profile_image_url
FROM comments
JOIN artists ON comments.artist_id = artists.artist_id
WHERE comments.post_id = $1;
              `;

              const result = await pool.query(getCommentDetailsQuery, [post_id]);


              if (result.rows.length > 0) {
                return NextResponse.json({ comments: result.rows }, { status: 200 });
            } else {
                return NextResponse.json({ message: "No comments found for this post." }, { status: 404 });
            }
            
        
    }catch (error) {
        console.error("Error getting comments", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
      }
}