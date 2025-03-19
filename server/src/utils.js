export const getS3PublicObjectUrl = (key) => {
    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${key}`;
}

export const formatEnpointName = (method, path) => {
    return `${method}:${path}`
}