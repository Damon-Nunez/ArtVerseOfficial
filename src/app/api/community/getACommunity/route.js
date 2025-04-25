import { NextResponse } from 'next/server';
import pool from '../../../../db';
import jwt from 'jsonwebtoken';

const communityCheckQuery =
`
SELECT * FROM communities
WHERE community_id = $1
`;

export async function GET(req) {
    try {
        // Authorization Code
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

        if (!artist_id) {
            return NextResponse.json({ error: 'Artist ID is missing from token' }, { status: 403 });
        }

        // Get community_id from query parameter
        const community_id = req.nextUrl.searchParams.get('id');

        if (!community_id) {
            return NextResponse.json({ error: 'community id is required' }, { status: 400 });
        }

        // Query the community from the database
        const results = await pool.query(communityCheckQuery, [community_id]);

        if (results.rowCount > 0) {
            const community = results.rows[0];  // Assuming the community exists in the first row

            // Send a structured response
            return new Response(JSON.stringify({
                community: {
                    id: community.community_id,
                    title: community.title,
                    description: community.description,
                    created_at: community.created_at,
                    // any other fields you'd like to include
                }
            }), {
                status: 200,
            });
        } else {
            return new Response(JSON.stringify({ error: 'This community does not exist' }), {
                status: 404,
            });
        }

    } catch (error) {
        console.error("Error fetching community", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
