#!/bin/sh
set -eu

: "${S3_ACCESS_KEY:?S3_ACCESS_KEY is required}"
: "${S3_SECRET_KEY:?S3_SECRET_KEY is required}"
: "${S3_BUCKET:?S3_BUCKET is required}"

mc alias set local http://minio:9000 "$S3_ACCESS_KEY" "$S3_SECRET_KEY"
mc mb --ignore-existing "local/$S3_BUCKET"
# Public read policy is convenient for MVP media URLs. For stricter production, serve media only through the API.
mc anonymous set download "local/$S3_BUCKET" || true

echo "MinIO bucket ready: $S3_BUCKET"
