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

const joinCommunityQuery =
`
INSERT INTO community_members (artist_id, community_id)
VALUES ($1, $2)

`

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

                const community_id = req.nextUrl.searchParams.get('id');
        
                if (!community_id) {
                    return NextResponse.json({ error: 'community id is required' }, { status: 400 });
                }
                const results = await pool.query(communityCheckQuery, [community_id])

                if(results.rows.length === 0) {
                    return NextResponse.json({message: "This community does not exist"}, {status:404})
                }

                const result = await pool.query(communityMemberCheck,[artist_id,community_id])

                if(result.rows.length === 1) {
                    return NextResponse.json({message:"You are already in this community!"}, {status:400});
                }

                const insertResults = await pool.query(joinCommunityQuery, [artist_id,community_id])

                if (insertResults.rowCount > 0) {
                    return NextResponse.json({ message: "You have joined the community" }, { status: 201 });
                  }
                  else {
                    return NextResponse.json({ message: 'Failed to join the community.' }, { status: 500 });

                }

    }catch(error) {
        console.error("Error joining community", error);
        return NextResponse.json({error: "Internal server error"}, {status:500});
    }
}