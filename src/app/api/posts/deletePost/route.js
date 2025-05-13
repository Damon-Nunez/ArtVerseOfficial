import pool from '../../../../db';

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const post_id = searchParams.get('post_id');

    if (!post_id) {
      return new Response(JSON.stringify({ error: "Missing post_id" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const query = 'DELETE FROM posts WHERE post_id = $1 RETURNING *';
    const result = await pool.query(query, [post_id]);

    if (result.rowCount === 0) {
      return new Response(JSON.stringify({ message: 'Post not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

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
