import { NextResponse } from 'next/server';
import pool from '../../../../db';
import jwt from 'jsonwebtoken';

export async function GET (req) {
    try {
        const getAllCommunitiesQuery = 'SELECT * FROM communities ORDER BY created_at DESC';

        const result = await pool.query(getAllCommunitiesQuery)

        return new Response(JSON.stringify(result.rows), {
            status: 200,
          });
    }catch(error){
        console.error("Error getting communities", error)
        return NextResponse.json({ error:"Internal server error"}, {status:500});

    }
}