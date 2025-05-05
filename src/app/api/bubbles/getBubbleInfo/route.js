import { NextResponse } from 'next/server';
import pool from '../../../../db';
import jwt from 'jsonwebtoken';

const getBubbleQuery =
`
SELECT * FROM bubbles
WHERE bubble_id = $1
`

export async function GET(req) {
    try {
        const bubble_id = req.nextUrl.searchParams.get('id');

        if (!bubble_id) {
            return NextResponse.json({ error: 'bubble ID is required' }, { status: 400 });
        }

        const result = await pool.query(getBubbleQuery, [bubble_id])

        if(result.rows.length > 0) {
            return NextResponse.json({bubbles: result.rows} , {status:200});
        } else {
            return NextResponse.json({ message: "Bubble not found!" }, { status: 404 });

        }

    }catch(error) {
        console.error("Error getting Bubble Information!", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}