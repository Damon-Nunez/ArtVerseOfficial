import { NextResponse } from 'next/server';
import pool from '../../../../db';
import jwt from 'jsonwebtoken';

const getAllMembersQuery = `
SELECT a.* FROM artists a
JOIN community_members cm ON a.artist_id = cm.artist_id
WHERE cm.community_id = $1;
`;

export async function GET(req) {
    try {
        // Authorization code (same as previous)
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

        // Query the community members from the database
        const results = await pool.query(getAllMembersQuery, [community_id]);

        if (results.rowCount > 0) {
            // Map over the results and structure the response
            const members = results.rows.map((artist) => ({
                id: artist.artist_id,
                name: artist.name,
                // add any other fields you want here, e.g., username, profile_picture, etc.
            }));

            // Respond with the structured members list
            return new Response(JSON.stringify({ members }), {
                status: 200,
            });
        } else {
            return new Response(JSON.stringify({ error: 'No members found for this community' }), {
                status: 404,
            });
        }

    } catch (error) {
        console.error("Error fetching community members", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
