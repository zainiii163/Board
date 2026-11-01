/** Preload for `npm test` — force in-memory demo CMS, never Aiven/live Postgres. */
process.env.BOARDNOTES_DATA_MODE = "demo";
