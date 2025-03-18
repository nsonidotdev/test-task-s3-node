export const bytesToMegabytes = (bytes) => {
    return bytes / (1024 * 1024)
}

export const getS3PublicObjectUrl = (key) => {
    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${key}`;
}