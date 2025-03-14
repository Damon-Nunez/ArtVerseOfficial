import { NextResponse } from "next/server";
import db from "../../../../db"; // Adjust based on your setup

export async function GET(req, { params }) {
  try {
    const { id } = await params; // ✅ Await params before using

    // Query the database for the specific post by ID
    const postQuery = await db.query("SELECT * FROM posts WHERE post_id = $1", [id]);

    if (postQuery.rows.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(postQuery.rows[0]);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
