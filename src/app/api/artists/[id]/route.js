import pool from '../../../../db';

export const DELETE = async (req) => {
    // Get the id from the URL (dynamic parameter)
    const url = new URL(req.url, `http://${req.headers.host}`);
    const id = url.pathname.split('/').pop(); // Extract the last part of the URL

    const artistId = parseInt(artist_id, 10);  // Convert it to an integer.
    if (isNaN(artistId)) {
        return new Response(
            JSON.stringify({ error: "Invalid artist ID" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    // Proceed with the database query to delete the artist by the ID.
    try {
        const result = await pool.query("DELETE FROM artists WHERE artist_id = $1", [artistId]);

        if (result.rowCount === 0) {
            return new Response(
                JSON.stringify({ error: "Artist not found" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({ message: "Artist removed successfully" }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error deleting artist:", error);
        return new Response(
            JSON.stringify({ error: "An error occurred while trying to remove the artist." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};

