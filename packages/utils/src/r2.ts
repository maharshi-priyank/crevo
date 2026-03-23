import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'

let _client: S3Client | undefined

export function getR2Client(config: {
  accountId: string
  accessKeyId: string
  secretAccessKey: string
}): S3Client {
  if (!_client) {
    _client = new S3Client({
      region: 'auto',
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    })
  }
  return _client
}

/**
 * Generate a presigned PUT URL for direct browser-to-R2 upload.
 * Requirement 3.3: presigned upload URL for product files.
 */
export async function getPresignedUploadUrl(
  client: S3Client,
  bucket: string,
  key: string,
  contentType: string,
  expiresInSeconds = 3600,
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  })
  return getSignedUrl(client, command, { expiresIn: expiresInSeconds })
}

/**
 * Generate a presigned GET URL for time-limited file delivery.
 * Requirement 6.1: signed URL with 24h TTL.
 */
export async function getPresignedDownloadUrl(
  client: S3Client,
  bucket: string,
  key: string,
  expiresInSeconds = 60 * 60 * 24, // 24h default
): Promise<string> {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key })
  return getSignedUrl(client, command, { expiresIn: expiresInSeconds })
}

/**
 * Delete an object from R2.
 */
export async function deleteR2Object(client: S3Client, bucket: string, key: string): Promise<void> {
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
}
