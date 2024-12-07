import { NextResponse } from 'next/server'; // Used to handle server responses
import pool from '../../../../db';

// Handle POST requests to add a follower
export async function POST(request) {
    try {
        // Parse the incoming JSON data
        const { follower_id, followed_id } = await request.json();

        // Validate that both follower_id and followed_id are provided
        if (!follower_id || !followed_id) {
            return NextResponse.json({ error: 'Both follower_id and followed_id are required.' }, { status: 400 });
        }

        // SQL query to insert a new follower relationship
        const query = `
            INSERT INTO followers (follower_id, followed_id)
            VALUES ($1, $2)
            ON CONFLICT (follower_id, followed_id) DO NOTHING
            RETURNING *;
        `;

        // Execute the query with provided follower and followed IDs
        const result = await pool.query(query, [follower_id, followed_id]);

        // Return the inserted record if successful
        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        // Log the error and send a server error response
        console.error('Error adding follower:', error);
        return NextResponse.json({ error: 'Error adding follower.' }, { status: 500 });
    }
}
