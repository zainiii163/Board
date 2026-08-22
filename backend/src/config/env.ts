export const env = {
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: process.env.DATABASE_URL ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "change-me",
  nodeEnv: process.env.NODE_ENV ?? "development",
  corsOrigins: (process.env.CORS_ORIGINS ?? "http://localhost:3000,http://127.0.0.1:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  publicApiUrl: (process.env.PUBLIC_API_URL ?? "").replace(/\/$/, ""),
  publicSiteUrl: (process.env.PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  r2Bucket: process.env.R2_BUCKET ?? "",
  r2AccessKey: process.env.R2_ACCESS_KEY ?? "",
  r2SecretKey: process.env.R2_SECRET_KEY ?? "",
  r2Endpoint: process.env.R2_ENDPOINT ?? "",
  r2PublicUrl: (process.env.R2_PUBLIC_URL ?? "").replace(/\/$/, ""),
};

export function isR2Configured() {
  return Boolean(env.r2Bucket && env.r2AccessKey && env.r2SecretKey && env.r2Endpoint);
}

export function isProduction() {
  return env.nodeEnv === "production";
}
