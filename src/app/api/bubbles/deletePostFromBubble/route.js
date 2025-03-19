import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import pool from '../../../../db';

export async function DELETE(req) {
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
                          return NextResponse.json({ error: 'bubble ID is required' }, { status: 400 });
                      }
          
                      const checkBubbleQuery =
                      ` SELECT * FROM bubbles
                      WHERE bubble_id = $1
                      `;
          
                      const results = await pool.query(checkBubbleQuery,[bubble_id])
                      
                      if(results.rows.length === 0) {
                          return NextResponse.json({ message: "The bubble does not exist fam"}, {status:400});
                      }
                      const { post_id } = await req.json();
                      if (!post_id) {
                        return NextResponse.json({ error: 'post_id is required' }, { status: 400 });
                    }
                    

            const deletePostFromBubbleQuery =
            `
            DELETE FROM bubble_posts
            WHERE post_id = $1 AND bubble_id = $2
            RETURNING *
            `;

            const deleteResult = await pool.query(deletePostFromBubbleQuery, [post_id, bubble_id])

            if (deleteResult.rowCount > 0) {
                return NextResponse.json({ message: "Post deleted from bubble successfully" }, { status: 200 });
            } else {
                return NextResponse.json({ message: 'Post not found in bubble, nothing to delete' }, { status: 404 });
            }
            



    }catch (error) {
        console.error('Error removing post from bubble', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
      }
}