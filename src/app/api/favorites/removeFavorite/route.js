import { NextResponse } from 'next/server';
import pool from '../../../../db';
import jwt from 'jsonwebtoken';

export async function DELETE(req) {
    try {
           //Authorization Code. This code decodes the token you put in and designates it as artist_id to know whos using this route
      const authHeader = req.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
  
      const token = authHeader.split(' ')[1];
      let decoded;
      try {
          decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
          return NextResponse.json({ error: 'Invalid or expired token' }, { status: 403 });
      }

      const artist_id = decoded.userId;

      // Check if artist_id exists
      if (!artist_id) {
          return NextResponse.json({ error: 'Artist ID is missing from token' }, { status: 403 });
      }


          //Designates the meaning of the number we put as a parameter
        const post_id = req.nextUrl.searchParams.get('id');
        
        if (!post_id) {
            return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
        }
        
        //Checks the PostQuery to see if the post exists
        const checkPostQuery = 
        `SELECT * FROM posts
        WHERE post_id = $1
        `; 

        const results = await pool.query(checkPostQuery, [post_id])

        if(results.rows.length === 0) {
            return NextResponse.json({ message: 'The post does not exist.'}, {status:404})
        }

        const checkFavoriteQuery =
        `
        SELECT * FROM favorites
        WHERE artist_id = $1 AND post_id = $2
        `;

        const result = await pool.query(checkFavoriteQuery, [artist_id,post_id]);
          
         if (result.rows.length === 0) {
             return NextResponse.json({ message: 'You have not favorited this post.' }, { status: 400 });
}

    const deleteFavoriteQuery = 
    `
    DELETE FROM favorites
    WHERE artist_id = $1 AND post_id = $2
    RETURNING *;
    `;

    const deleteResult = await pool.query(deleteFavoriteQuery, [artist_id,post_id]);

    if (deleteResult.rowCount > 0) {
return NextResponse.json({ message: "favorite deleted successfully." }, { status: 200 });
} else {
return NextResponse.json({ message: "No favorite found to delete." }, { status: 404 });
}



    }catch(error) {
        console.error("Error removing favorite", error);
        return NextResponse.json({error:"Internal server error"}, {status:500});
    }
}