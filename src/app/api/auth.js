import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../../db'; // Adjust the path if necessary
import dotenv from 'dotenv';

dotenv.config();

export const login = async (req) => {
    try {
        const { email, password } = await req.json(); // Extract JSON from the request body

        if (!email || !password) {
            return new Response(JSON.stringify({ error: "Email and password are required." }), { status: 400 });
        }

        const queryResult = await pool.query('SELECT * FROM artists WHERE email = $1', [email]);
        const user = queryResult.rows[0];

        if (user && await bcrypt.compare(password, user.password)) {
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
};
