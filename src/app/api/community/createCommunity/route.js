import { NextResponse } from 'next/server';
import pool from '../../../../db';
import jwt from 'jsonwebtoken';

const createCommunityQuery =
`INSERT INTO communities (title, description, visibility, creator_id)
VALUES ($1, $2, $3, $4)
RETURNING community_id;`;

const addMemberQuery =
`INSERT INTO community_members (community_id, artist_id)
VALUES ($1, $2);`;

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

        // Check if artist_id exists
        if (!artist_id) {
            return NextResponse.json({ error: 'Artist ID is missing from token' }, { status: 403 });
        }

        const { title, description, visibility } = await req.json();

        if (!title || !description || visibility === undefined) {
            return NextResponse.json({ error: "Title, description, and visibility status are required" }, { status: 400 });
        }

        // Create the community
        const result = await pool.query(createCommunityQuery, [
            title,
            description,
            visibility,
            artist_id // Use artist_id as creator_id
        ]);

        if (result.rowCount > 0) {
            const community_id = result.rows[0].community_id;

            // Add the creator as a member of the community
            await pool.query(addMemberQuery, [community_id, artist_id]);

            return NextResponse.json({ message: "Community created and user added successfully", community_id }, { status: 201 });
        } else {
            return NextResponse.json({ message: "Failed to create community" }, { status: 500 });
        }
    } catch (error) {
        console.error('Error creating community', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
