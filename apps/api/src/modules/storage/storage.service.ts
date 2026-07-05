import { DeleteObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";

@Injectable()
export class StorageService {
  readonly bucket = process.env.S3_BUCKET ?? "knife-workshop-media";
  readonly client = new S3Client({
    region: process.env.S3_REGION ?? "us-east-1",
    endpoint: process.env.S3_ENDPOINT ?? "http://minio:9000",
    forcePathStyle: (process.env.S3_FORCE_PATH_STYLE ?? "true") === "true",
    credentials: { accessKeyId: process.env.S3_ACCESS_KEY ?? "minioadmin", secretAccessKey: process.env.S3_SECRET_KEY ?? "minioadminpassword" }
  });

  async put(key: string, body: Buffer, contentType: string) {
    await this.client.send(new PutObjectCommand({ Bucket: this.bucket, Key: key, Body: body, ContentType: contentType, CacheControl: "public, max-age=31536000, immutable" }));
    return key;
  }
  async delete(key: string) { await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key })); }
  async deleteMany(keys: string[]) { await Promise.all(keys.map((key) => this.delete(key))); }
  async exists(key: string) { try { await this.client.send(new HeadObjectCommand({ Bucket: this.bucket, Key: key })); return true; } catch { return false; } }
  publicUrl(key: string) { return `${process.env.S3_PUBLIC_ENDPOINT ?? "http://localhost:9000"}/${this.bucket}/${key}`; }
}
