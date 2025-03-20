import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../index.js';

export const handleReplace = async (req, res) => {
	const key = req.query.key;

	let chunks = [];
	req.on('data', (chunk) => chunks.push(chunk));
	
	req.on('end', async () => {
		const fileBuffer = Buffer.concat(chunks); // Convert to a buffer
		const fileType = req.headers['content-type'];

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
			const replaceResult = await s3Client.send(
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
