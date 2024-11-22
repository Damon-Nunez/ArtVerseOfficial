// src/lib/db.js

import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const pool = new Pool({
  user: "postgres",
    host: "localhost",
    database: "artists",
    password:"damon1",
    port: 5432,
});

export default pool;
