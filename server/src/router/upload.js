import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getS3PublicObjectUrl, validateFile } from '../utils.js';
import { s3Client } from '../index.js';

export const handleUpload = (req, res) => {
	const directory = decodeURIComponent(req.query.dir);
	const fileType = req.headers['content-type'];
	const filename = req.headers['x-file-name'];

	console.log('filetype', fileType, filename, directory);

	const chunks = [];
	req.on('data', (chunk) => chunks.push(chunk));
	req.on('end', async () => {
		const fileBuffer = Buffer.concat(chunks);
		const validationResult = validateFile(fileBuffer, fileType);

		if (!validationResult.valid) {
			res.writeHead(validationResult.code);
			res.end(JSON.stringify({ message: validationResult.message }));
			return;
		}

		let S3Key = directory.length > 0 ? `${directory}/${filename}` : filename;

		const putCommand = new PutObjectCommand({
			Bucket: process.env.AWS_S3_BUCKET_NAME,
			Key: S3Key,
			Body: fileBuffer,
			ContentType: fileType,
		});

		try {
			await s3Client.send(putCommand);
			const publicUrl = getS3PublicObjectUrl(S3Key);

			res.writeHead(200);
			res.end(
				JSON.stringify({
					url: publicUrl,
				})
			);
		} catch (error) {
			res.writeHead(500);
			res.end({
				message: 'Error happened while uploading a file',
			});
		}
	});
};
