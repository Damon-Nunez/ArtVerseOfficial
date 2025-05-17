import pool from '../../../../db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const offset = (page - 1) * limit;

    const query = `
      SELECT * FROM posts
      ORDER BY RANDOM()
      LIMIT $1 OFFSET $2
    `;

    const result = await pool.query(query, [limit, offset]);

    return new Response(JSON.stringify(result.rows), {
      status: 200,
    });

  } catch (error) {
    console.error('Error fetching posts with pagination:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch posts' }), {
      status: 500,
    });
  }
}
