import pool from '../../../../db';

export const GET = async () => {
    try {
        // Query to fetch all artists
        const queryResult = await pool.query("SELECT * FROM artists");

        // Return the JSON response with the list of artists
        return new Response(JSON.stringify(queryResult.rows), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching artists:", error);

        // Return an error response
        return new Response(
            JSON.stringify({ error: "An error occurred while retrieving artists." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};
