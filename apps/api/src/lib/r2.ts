import { getR2Client, getPresignedUploadUrl, getPresignedDownloadUrl, deleteR2Object } from '@creator-os/utils'
import { getEnv } from '@creator-os/config'
import type { S3Client } from '@aws-sdk/client-s3'

let _client: S3Client | undefined

function getClient(): S3Client {
  if (!_client) {
    const env = getEnv()
    _client = getR2Client({
      accountId: env.R2_ACCOUNT_ID,
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    })
  }
  return _client
}

function getBucket(): string {
  return getEnv().R2_BUCKET_NAME
}

export async function generateUploadUrl(key: string, contentType: string): Promise<string> {
  return getPresignedUploadUrl(getClient(), getBucket(), key, contentType)
}

export async function generateDownloadUrl(key: string, expiresInSeconds?: number): Promise<string> {
  return getPresignedDownloadUrl(getClient(), getBucket(), key, expiresInSeconds)
}

export async function removeObject(key: string): Promise<void> {
  return deleteR2Object(getClient(), getBucket(), key)
}
