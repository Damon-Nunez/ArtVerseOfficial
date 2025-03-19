import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import pool from '../../../../db';
import { Next } from 'react-bootstrap/esm/PageItem';

export async function PUT(req) {
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

            // Extract & Validate Input
        const { title, description, is_public } = await req.json();

        if (!title || !description || is_public === undefined) {
            return NextResponse.json({ error: "Title, description, and publicity status are required" }, { status: 400 });
        }
            const isPublicBool = Boolean(is_public)

            const editBubbleQuery = `
            UPDATE bubbles
            SET title = $1, description = $2, is_public = $3
            WHERE bubble_id = $4
            RETURNING *;
          `;

          const result = await pool.query(editBubbleQuery, [
            title,        // $1
            description,  // $2
            is_public,    // $3
            bubble_id     // $4
          ]);
          
          

            if (result.rowCount > 0) {
                return NextResponse.json({ message: 'Bubble updated successfully', bubble: result.rows[0] }, { status: 200 });
              } else {
                return NextResponse.json({ message: 'Failed to update bubble or bubble not found' }, { status: 404 });
              }



    }  catch (error) {
        console.error('Error updating bubble', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
      }
}