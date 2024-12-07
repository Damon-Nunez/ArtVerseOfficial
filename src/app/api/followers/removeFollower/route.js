import { NextResponse } from 'next/server'; // Used to handle server responses
import pool from '../../../../db';

// Handle POST requests to remove a follower relationship
export async function DELETE(request) {
    try {
        // Parse the incoming JSON data
        const { follower_id, followed_id } = await request.json();

        // Validate that both follower_id and followed_id are provided
        if (!follower_id || !followed_id) {
            return NextResponse.json({ error: 'Both follower_id and followed_id are required.' }, { status: 400 });
        }

        // SQL query to delete the follower relationship
        const query = `
            DELETE FROM followers
            WHERE follower_id = $1 AND followed_id = $2
            RETURNING *;
        `;

        // Execute the query with provided follower and followed IDs
        const result = await pool.query(query, [follower_id, followed_id]);

        // If no rows are affected, the relationship doesn't exist
        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Follower relationship not found.' }, { status: 404 });
        }

        // Return a success message if the relationship is removed
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        // Log the error and send a server error response
        console.error('Error removing follower:', error);
        return NextResponse.json({ error: 'Error removing follower.' }, { status: 500 });
    }
}
