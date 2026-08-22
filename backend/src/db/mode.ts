import { connectDb } from "./index.js";

let dbAvailable: boolean | null = null;

export async function initDbMode(): Promise<boolean> {
  dbAvailable = await connectDb();
  return dbAvailable;
}

/** True when PostgreSQL is connected — CMS reads/writes use the database. */
export function useDb(): boolean {
  return dbAvailable === true;
}
