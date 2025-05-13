import { NextResponse } from 'next/server';
import pool from '../../../../db';
import jwt from 'jsonwebtoken';

const addBubbleQuery = `
    INSERT INTO bubbles (artist_id, title, description, is_public, thumbnail)
    VALUES ($1, $2, $3, $4, $5)
`;


export async function POST(req) {
    try {
        // Authorization
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

        // Extract & Validate Input
        const { title, description, is_public, thumbnail } = await req.json();

        if (!title || !description || is_public === undefined) {
            return NextResponse.json({ error: "Title, description, and publicity status are required" }, { status: 400 });
        }

        const isPublicBool = Boolean(is_public);

        // Insert into Database
      const result = await pool.query(addBubbleQuery, [
  artist_id,
  title,
  description,
  isPublicBool,
  thumbnail || null
]);


        if (result.rowCount > 0) {
            return NextResponse.json({ message: 'Bubble created successfully' }, { status: 201 });
        } else {
            return NextResponse.json({ message: 'Failed to create Bubble' }, { status: 500 });
        }

    } catch (error) {
        console.error("Error creating a bubble", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
