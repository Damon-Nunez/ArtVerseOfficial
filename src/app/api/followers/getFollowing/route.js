import { NextResponse } from 'next/server'; // Used to handle server responses
import pool from '../../../../db';

// Handle GET requests to retrieve users a user is following
export async function GET(request) {
    try {
        // Extract query parameters from the request URL
        const { searchParams } = new URL(request.url);
        const follower_id = searchParams.get('follower_id'); // ID of the user who is following

        // Validate that the follower_id is provided
        if (!follower_id) {
            return NextResponse.json({ error: 'follower_id is required.' }, { status: 400 });
        }

        // SQL query to retrieve all users being followed by the specified user
        const query = `
            SELECT a.id, a.name, a.profile_image_url
            FROM followers f
            JOIN artists a ON f.followed_id = a.id
            WHERE f.follower_id = $1;
        `;

        // Execute the query with the provided follower_id
        const result = await pool.query(query, [follower_id]);

        // Return the list of users being followed
        return NextResponse.json(result.rows, { status: 200 });
    } catch (error) {
        // Log the error and send a server error response
        console.error('Error retrieving following:', error);
        return NextResponse.json({ error: 'Error retrieving following.' }, { status: 500 });
    }
}
