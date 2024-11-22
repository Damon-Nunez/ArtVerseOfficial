import pool from '../../../../db';  // Adjust the path to your db connection

const getArtistById = 'SELECT * FROM artists WHERE id = $1';
const updateArtist = 'UPDATE artists SET name = $1 WHERE id = $2';

export async function PUT(req) {
    const url = new URL(req.url); // Parse the request URL
    const id = url.searchParams.get("id"); // Extract the `id` query parameter
    const { name } = await req.json(); // Parse the request body

    if (!id) {
        return new Response("ID is required", { status: 400 });
    }

    try {
        const getArtistById = "SELECT * FROM artists WHERE id = $1";
        const updateArtist = "UPDATE artists SET name = $1 WHERE id = $2";

        // Check if the artist exists
        const artistResult = await pool.query(getArtistById, [id]);
        if (!artistResult.rows.length) {
            return new Response("Artist not found", { status: 404 });
        }

        // Update the artist
        await pool.query(updateArtist, [name, id]);
        return new Response("Artist updated successfully", { status: 200 });
    } catch (error) {
        console.error("Error updating artist:", error);
        return new Response("Internal server error", { status: 500 });
    }
}