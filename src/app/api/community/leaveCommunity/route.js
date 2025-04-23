import { NextResponse } from 'next/server';
import pool from '../../../../db';
import jwt from 'jsonwebtoken';

const communityCheckQuery =
`
SELECT * FROM communities
WHERE community_id = $1
`

const communityMemberCheck = 
`
SELECT * FROM community_members
WHERE artist_id = $1 AND community_id = $2

`

const leaveCommunityQuery =
`
DELETE FROM community_members
WHERE artist_id = $1 AND community_id = $2;
`
export async function DELETE(req) {
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
              const community_id = req.nextUrl.searchParams.get('id');
        
              if (!community_id) {
                  return NextResponse.json({ error: 'community id is required' }, { status: 400 });
              }

              const results = await pool.query(communityCheckQuery, [community_id])

              if(results.rows.length === 0) {
                  return NextResponse.json({message: "This community does not exist"}, {status:404})
              }

              const result = await pool.query(communityMemberCheck,[artist_id,community_id])

              if(result.rows.length === 0) {
                return NextResponse.json({message:"You are not in this community!"}, {status:400});
            }

              const leaveCommunityResult = await pool.query(leaveCommunityQuery, [artist_id,community_id])

                if(leaveCommunityResult.rowCount > 0) {
                    return NextResponse.json({message: "You have left the community"},{status:200});
                }else {
                    return NextResponse.json({message: "Failed to leave the community"},{status:500});
                }
    }catch(error) {
        console.error("Error leaving community", error);
        return NextResponse.json({ error:"Internal server error"}, {status:500});
    }
}