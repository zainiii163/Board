import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema.js";
import "dotenv/config";

const DATABASE_URL =
  process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5433/boardnotes";

const needsSsl =
  /sslmode=require/i.test(DATABASE_URL) ||
  /\.aivencloud\.com/i.test(DATABASE_URL) ||
  Boolean(process.env.VERCEL);

// Serverless (Vercel) should keep the pool tiny to avoid exhausting Aiven Free limits.
const poolMax = process.env.DB_POOL_MAX
  ? Number(process.env.DB_POOL_MAX)
  : process.env.VERCEL
    ? 1
    : 5;

const pool = new pg.Pool({
  connectionString: DATABASE_URL,
  max: Number.isFinite(poolMax) && poolMax > 0 ? poolMax : 5,
  statement_timeout: 5000,
  connectionTimeoutMillis: 8000,
  idleTimeoutMillis: process.env.VERCEL ? 1000 : 10000,
  allowExitOnIdle: Boolean(process.env.VERCEL),
  ...(needsSsl ? { ssl: { rejectUnauthorized: false } } : {}),
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
