import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema.js";
import "dotenv/config";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/boardnotes",
});

export const db = drizzle(pool, { schema });

export async function connectDb() {
  try {
    await pool.query("SELECT 1");
    console.log("[db] PostgreSQL connection established.");
  } catch (err) {
    console.error("[db] Failed to connect to PostgreSQL:", err);
  }
}
