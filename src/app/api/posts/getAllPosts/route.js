import  pool  from '../../../../db'; // Assuming the pool connection is set up

export async function GET(request) {
  try {
    // Query to fetch all posts
    const query = 'SELECT * FROM posts ORDER BY created_at DESC';
    
    // Execute query
    const result = await pool.query(query);
    
    // Return the posts as a response
    return new Response(JSON.stringify(result.rows), {
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch posts' }), {
      status: 500,
    });
  }
}
