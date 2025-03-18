import { NextResponse } from 'next/server';
import pool from '../../../../db';
import jwt from 'jsonwebtoken';

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

              const comment_id = req.nextUrl.searchParams.get('id');

              if(!comment_id) {
                return NextResponse.json({error:"Comment_Id is required"}, {status:400});
              }

              const checkCommentQuery =
              `SELECT * FROM comments
              WHERE comment_id = $1
              `;
              const result = await pool.query(checkCommentQuery, [comment_id])

              if (result.rows[0].artist_id !== artist_id) {
                return NextResponse.json({ message: 'You are not authorized to delete this comment' }, { status: 403 });
              }            
              
              if(result.rows.length === 0) {
                return NextResponse.json({message: "The comment does not exist"}, {status:404})
              }

              const deleteCommentQuery = `
              DELETE FROM comments
              WHERE comment_id = $1
              RETURNING *;
              `;

              const deleteResult = await pool.query(deleteCommentQuery, [comment_id])

              if (deleteResult.rowCount > 0){
                return NextResponse.json({message:"Comment successfully deleted"}, {status:200});
              }else {
                return NextResponse.json({message: "Comment was not deleted"}, {status:400});
              }

    }catch(error) {
        console.error("Error deleting comment", error);
        return NextResponse.json({ error:"Internal server error"}, {status:500});
    }
}