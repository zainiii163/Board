import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema.js";
import "dotenv/config";

const DATABASE_URL =
  process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5433/boardnotes";

const pool = new pg.Pool({
  connectionString: DATABASE_URL,
  max: 5,
  statement_timeout: 5000,
});

export const db = drizzle(pool, { schema });
export const isDbConfigured = Boolean(process.env.DATABASE_URL);

export async function connectDb() {
  try {
    await pool.query("SELECT 1");
    console.log("[db] PostgreSQL connection established.");
    return true;
  } catch (err) {
    console.warn("[db] PostgreSQL unavailable; continuing with fallback demo data:", err instanceof Error ? err.message : err);
    return false;
  }
}
