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

            const deleteBubbleQuery = 
            `
            DELETE FROM bubbles
            WHERE bubble_id = $1
            RETURNING *;
            `;

            const deleteResult = await pool.query(deleteBubbleQuery, [bubble_id]);

            if(deleteResult.rowCount > 0) {
                return NextResponse.json({message: "Bubble successfully deleted"}, {status:200});

            } else {
                return NextResponse.json({message: 'Bubble was not deleted'}, {status:400});
            }
            
    }catch(error) {
        console.error("Error adding comment", error);
        return NextResponse.json({ error:"Internal server error"}, {status:500});
    }
}