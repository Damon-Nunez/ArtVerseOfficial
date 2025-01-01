import pool from '../../../../db';

export async function POST(req) {
  try {
    const { user_id, content_url, description, tags, type } = await req.json();

    // Ensure `tags` is formatted as an array literal
    const formattedTags = `{${tags.join(',')}}`; // Convert array to PostgreSQL array format

    // Define the SQL query
    const query = `
      INSERT INTO posts (user_id, content_url, description, tags, type)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    // Use a client to execute the query
    const client = await pool.connect();
    try {
      const result = await client.query(query, [user_id, content_url, description, formattedTags, type]);
      return new Response(JSON.stringify(result.rows[0]), { status: 201 });
    } finally {
      client.release(); // Release the client back to the pool
    }
  } catch (error) {
    console.error('Error in createPost:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
