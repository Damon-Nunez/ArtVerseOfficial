import { NextResponse } from 'next/server';
import pool from '../../../../db';
import jwt from 'jsonwebtoken';

const showUserCommunitiesQuery =
`
SELECT c.*
FROM community_members cm
JOIN communities c ON cm.community_id = c.community_id
WHERE cm.artist_id = $1;
`

export async function GET(req) {
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

              const results = await pool.query(showUserCommunitiesQuery,[artist_id])

              if(results.rowCount > 0) {
                return new Response(JSON.stringify(results.rows), {
                    status: 200,
                  });
              } else {
                return Response.json({message:"you are not in any communities!"}, {status:500});
              }
            

    }catch(error){
        console.error("Error getting user communities", error);
        return NextResponse.json({ error:"Internal server error"}, {status:500});
    }
}