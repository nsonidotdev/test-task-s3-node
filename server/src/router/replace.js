import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../index.js';
import { validateFile } from '../utils.js';

export const handleReplace = async (req, res) => {
	const key = decodeURIComponent(req.params.key);

	let chunks = [];
	req.on('data', (chunk) => chunks.push(chunk));

	req.on('end', async () => {
		const fileBuffer = Buffer.concat(chunks); 
		const fileType = req.headers['content-type'];
		const validationResult = validateFile(fileBuffer, fileType);

		if (!validationResult.valid) {
			res.writeHead(validationResult.code);
			res.end(JSON.stringify({ message: validationResult.message }));
			return;
		}

		try {
			const existingObject = await s3Client.send(
				new GetObjectCommand({
					Bucket: process.env.AWS_S3_BUCKET_NAME,
					Key: key,
				})
			);

			if (!existingObject) throw 0;
		} catch (error) {
			res.writeHead(404);
			res.end(
				JSON.stringify({
					message: 'Object does not exist',
				})
			);
			return;
		}

		try {
			await s3Client.send(
				new PutObjectCommand({
					Bucket: process.env.AWS_S3_BUCKET_NAME,
					Key: key,
					Body: fileBuffer,
					ContentType: fileType,
					ContentLength: fileBuffer.length,
				})
			);

			res.writeHead(200);
			res.end(
				JSON.stringify({
					message: `Replace successful`,
				})
			);
			return;
		} catch (error) {
			console.log('ERROR', error);
			res.writeHead(500);
			res.end(
				JSON.stringify({
					message: `Error replacing Object ${key}`,
				})
			);
			return;
		}
	});
};
