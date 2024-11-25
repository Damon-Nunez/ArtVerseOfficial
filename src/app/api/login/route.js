import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../../../db'; // Adjust the path to db.js as necessary
import dotenv from 'dotenv';

dotenv.config();

export async function POST(req) {
    try {
        // Parse the request body for email and password
        const { email, password } = await req.json();

        if (!email || !password) {
            return new Response(JSON.stringify({ error: "Email and password are required." }), { status: 400 });
        }

        // Query the database to find the user by email
        const queryResult = await pool.query('SELECT * FROM artists WHERE email = $1', [email]);
        const user = queryResult.rows[0];

        if (user && await bcrypt.compare(password, user.password)) {
            // Check if the JWT secret is available in environment variables
            if (!process.env.JWT_SECRET) {
                console.error('JWT_SECRET is not defined in environment variables.');
                return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
            }

            // Create a JWT token for the authenticated user
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            return new Response(JSON.stringify({ token }), { status: 200 });
        }

        return new Response(JSON.stringify({ error: "Invalid credentials." }), { status: 401 });
    } catch (err) {
        console.error('Error during login:', err);
        return new Response(JSON.stringify({ error: "An error occurred during login." }), { status: 500 });
    }
}
