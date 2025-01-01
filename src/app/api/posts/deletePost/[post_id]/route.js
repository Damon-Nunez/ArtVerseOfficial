import pool from '../../../../../db'; // Import the db connection (adjust path if necessary)

export async function DELETE(request, { params }) {
  try {
    // Destructure post_id from params
    const { post_id } = await params;

    // Define the query to delete the post by post_id
    const query = 'DELETE FROM posts WHERE id = $1 RETURNING *';

    // Execute the query with the post_id parameter
    const result = await pool.query(query, [post_id]);

    // Check if the post was deleted
    if (result.rowCount === 0) {
      return new Response(JSON.stringify({ message: 'Post not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Return a success response with the deleted post
    return new Response(JSON.stringify({ message: 'Post deleted successfully', post: result.rows[0] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    return new Response(JSON.stringify({ error: "Unable to delete post" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
