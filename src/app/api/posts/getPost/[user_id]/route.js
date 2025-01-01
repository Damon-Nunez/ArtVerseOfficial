import  pool  from '../../../../../db'

export async function GET(request, { params }) {
  const { user_id } = await params;  // Assume user_id is passed as a parameter in the URL

  try {
    const query = 'SELECT * FROM posts WHERE user_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [user_id]);

    return new Response(JSON.stringify(result.rows), {
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch user posts' }), {
      status: 500,
    });
  }
}




