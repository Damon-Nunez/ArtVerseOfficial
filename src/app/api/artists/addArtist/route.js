import pool from '../../../../db';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

const checkEmailExists = "SELECT * FROM artists WHERE email = $1::VARCHAR";
const addArtistQuery = `
  INSERT INTO artists (name, email, age, dob, password, bio, instagram_link, twitter_link, youtube_link)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
`;

export async function POST(req) {
    try {
        const { name, email, age, dob, password, bio, instagram_link, twitter_link, youtube_link } = await req.json();

        // Validate required fields
        if (!name || !email || !password) {
            return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });
        }

        // Check if email already exists
        const emailCheck = await pool.query(checkEmailExists, [email]);

        if (emailCheck.rows.length > 0) {
            return NextResponse.json({ error: "Email already exists." }, { status: 400 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the artist into the database
        await pool.query(addArtistQuery, [
            name,
            email,
            age,
            dob,
            hashedPassword,
            bio,
            instagram_link || null,  // Set to null if no link is provided
            twitter_link || null,     // Set to null if no link is provided
            youtube_link || null      // Set to null if no link is provided
        ]);

        return NextResponse.json({ message: "Artist created successfully!" }, { status: 201 });
    } catch (error) {
        console.error("Error adding artist:", error);
        return NextResponse.json({ error: "An error occurred while adding the artist." }, { status: 500 });
    }
}
