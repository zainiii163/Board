import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { env } from "../config/env.js";

export function isR2Enabled() {
  return Boolean(env.r2Bucket && env.r2AccessKey && env.r2SecretKey && env.r2Endpoint);
}

function getClient() {
  return new S3Client({
    region: "auto",
    endpoint: env.r2Endpoint,
    credentials: {
      accessKeyId: env.r2AccessKey,
      secretAccessKey: env.r2SecretKey,
    },
  });
}

function uploadKey(filename: string) {
  return `uploads/${filename}`;
}

export async function r2PutPdf(filename: string, buffer: Buffer) {
  await getClient().send(
    new PutObjectCommand({
      Bucket: env.r2Bucket,
      Key: uploadKey(filename),
      Body: buffer,
      ContentType: "application/pdf",
    }),
  );
}

export async function r2DeletePdf(filename: string) {
  await getClient().send(
    new DeleteObjectCommand({
      Bucket: env.r2Bucket,
      Key: uploadKey(filename),
    }),
  );
}

export async function r2GetPdfBuffer(filename: string) {
  const response = await getClient().send(
    new GetObjectCommand({
      Bucket: env.r2Bucket,
      Key: uploadKey(filename),
    }),
  );
  if (!response.Body) throw new Error("Empty R2 object body.");
  return Buffer.from(await response.Body.transformToByteArray());
}

export async function r2ListUploads() {
  const response = await getClient().send(
    new ListObjectsV2Command({
      Bucket: env.r2Bucket,
      Prefix: "uploads/",
    }),
  );
  return (response.Contents ?? [])
    .filter((item) => item.Key?.endsWith(".pdf"))
    .map((item) => ({
      filename: item.Key!.replace(/^uploads\//, ""),
      size: item.Size ?? 0,
      uploadedAt: item.LastModified?.toISOString() ?? new Date().toISOString(),
    }));
}

export function r2PublicUrl(filename: string) {
  if (env.r2PublicUrl) return `${env.r2PublicUrl}/uploads/${filename}`;
  return null;
}
