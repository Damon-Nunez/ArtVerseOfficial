import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import pool from '../../../../db';

export async function POST(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const artistId = decoded.userId;

    if (!artistId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }

    // Extract the fields from the request body
    const { name, bio, instagram_link, twitter_link, youtube_link, profile_image_url } = await req.json();
    console.log("Request data:", { name, bio, instagram_link, twitter_link, youtube_link, profile_image_url });

    const updateFields = [];
    const updateValues = [];

    // Dynamically build the fields to update
    if (name) {
      updateFields.push('name = $' + (updateValues.length + 1));
      updateValues.push(name);
    }

    if (bio) {
      updateFields.push('bio = $' + (updateValues.length + 1));
      updateValues.push(bio);
    }

    if (instagram_link) {
      updateFields.push('instagram_link = $' + (updateValues.length + 1));
      updateValues.push(instagram_link);
    }

    if (twitter_link) {
      updateFields.push('twitter_link = $' + (updateValues.length + 1));
      updateValues.push(twitter_link);
    }

    if (youtube_link) {
      updateFields.push('youtube_link = $' + (updateValues.length + 1));
      updateValues.push(youtube_link);
    }

    if (profile_image_url) {
      updateFields.push('profile_image_url = $' + (updateValues.length + 1));
      updateValues.push(profile_image_url);
    }

    // If no fields are provided, return an error
    if (updateFields.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    // Construct the query with the dynamic fields
    const updateQuery = `
      UPDATE artists
      SET ${updateFields.join(', ')}
      WHERE id = $${updateValues.length + 1}
      RETURNING name, bio, instagram_link, twitter_link, youtube_link, profile_image_url;
    `;

    // Add the artistId as the final parameter
    updateValues.push(artistId);

    console.log("Generated SQL query:", updateQuery);  // Debugging: See the generated query

    const { rows } = await pool.query(updateQuery, updateValues);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    // Return the updated profile information
    return NextResponse.json({
      success: true,
      profile: {
        name: rows[0].name,
        bio: rows[0].bio,
        instagram_link: rows[0].instagram_link,
        twitter_link: rows[0].twitter_link,
        youtube_link: rows[0].youtube_link,
        profile_image_url: rows[0].profile_image_url,
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating artist profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
