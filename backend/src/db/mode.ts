import { connectDb } from "./index.js";

let dbAvailable: boolean | null = null;

function wantsDemoMode() {
  return process.env.BOARDNOTES_DATA_MODE === "demo" || process.env.FORCE_DEMO_CMS === "true";
}

export async function initDbMode(): Promise<boolean> {
  // Deterministic test / local demo path — never touch live Postgres contents.
  if (wantsDemoMode()) {
    dbAvailable = false;
    console.log("[db] BOARDNOTES_DATA_MODE=demo — using in-memory CMS.");
    return false;
  }
  dbAvailable = await connectDb();
  return dbAvailable;
}

/** True when PostgreSQL is connected — CMS reads/writes use the database. */
export function useDb(): boolean {
  return dbAvailable === true;
}

/** Test helper: clear cached DB mode so the next bootstrap re-evaluates. */
export function resetDbModeForTests() {
  dbAvailable = null;
}
