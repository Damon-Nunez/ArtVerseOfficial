import { NextResponse } from 'next/server'; // Used to handle server responses
import pool from '../../../../db';

// Handle GET requests to retrieve followers for a user
export async function GET(request) {
    try {
        // Extract query parameters from the request URL
        const { searchParams } = new URL(request.url);
        const followed_id = searchParams.get('followed_id'); // ID of the user being followed

        // Validate that the followed_id is provided
        if (!followed_id) {
            return NextResponse.json({ error: 'followed_id is required.' }, { status: 400 });
        }

        // SQL query to retrieve all followers of the specified user
        const query = `
            SELECT a.id, a.name, a.profile_image_url
            FROM followers f
            JOIN artists a ON f.follower_id = a.id
            WHERE f.followed_id = $1;
        `;

        // Execute the query with the provided followed_id
        const result = await pool.query(query, [followed_id]);

        // Return the list of followers
        return NextResponse.json(result.rows, { status: 200 });
    } catch (error) {
        // Log the error and send a server error response
        console.error('Error retrieving followers:', error);
        return NextResponse.json({ error: 'Error retrieving followers.' }, { status: 500 });
    }
}
