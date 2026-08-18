export const env = {
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: process.env.DATABASE_URL ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "change-me",
  r2Bucket: process.env.R2_BUCKET ?? "",
  r2AccessKey: process.env.R2_ACCESS_KEY ?? "",
  r2SecretKey: process.env.R2_SECRET_KEY ?? "",
  r2Endpoint: process.env.R2_ENDPOINT ?? "",
  nodeEnv: process.env.NODE_ENV ?? "development",
};
