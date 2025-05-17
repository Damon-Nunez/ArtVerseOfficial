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

              const getAllBubblesQuery =
              ` SELECT * FROM bubbles
              WHERE artist_id = $1
              ORDER BY created_at DESC
              `;
            
              const result = await pool.query(getAllBubblesQuery, [artist_id])

      if (result.rows.length > 0){       
    return NextResponse.json({ bubbles: result.rows }, { status: 200 });
} else {
return NextResponse.json({ bubbles: [] }, { status: 200 });
}



    }catch (error) {
        console.error("Error getting user Bubbles", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}