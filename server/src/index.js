import 'dotenv/config';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import busboy from 'busboy';
import http from 'http';

import { allowedMimes, fileSizeLimit } from './constants.js';
import { getS3PublicObjectUrl } from './utils.js';

const s3Client = new S3Client({
	region: process.env.AWS_S3_REGION,
	credentials: {
		accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
	},
});

const PORT = process.env.PORT ?? 3000;
console.log(PORT);

const server = http
	.createServer((req, res) => {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader(
			'Access-Control-Allow-Methods',
			'GET, POST, PUT, DELETE, OPTIONS'
		);
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

		if (req.method === 'POST' && req.url === '/upload') {
			const bb = busboy({
				headers: req.headers,
				limits: { fileSize: fileSizeLimit },
			});

			let uploadData = {
				directory: '',
				file: {
					name: '',
					mimeType: '',
					buffer: null,
				},
			};

			bb.on('field', (key, value) => {
				if (key === 'directory') {
					uploadData.directory = value.trim();
				}
			});

			bb.on('file', async (formKey, file, info) => {
				if (formKey !== 'attachment') {
					res.writeHead(400);
					res.end(JSON.stringify({ message: 'No attachment field found' }));
					return;
				}

				if (!allowedMimes.includes(info.mimeType)) {
					res.writeHead(400);
					res.end(
						JSON.stringify({ message: 'This file type is not supported' })
					);
					return;
				}

				let chunks = [];

				file.on('data', (chunk) => {
					chunks.push(chunk);
				});

				file.on("end", () => {
					const fileBuffer = Buffer.concat(chunks);

					uploadData.file = {
						buffer: fileBuffer,
						mimeType: info.mimeType,
						name: info.filename,
					};
				})
			});

			bb.on('close', async () => {
				let fileName = uploadData.file.name;
				let s3Path =
					uploadData.directory.length > 0
						? `${uploadData.directory}/${fileName}`
						: fileName;

				const putCommand = new PutObjectCommand({
					Body: uploadData.file.buffer,
					Bucket: process.env.AWS_S3_BUCKET_NAME,
					Key: s3Path,
					ContentType: uploadData.file.mimeType,
				});

				await s3Client.send(putCommand);

				const publicUrl = getS3PublicObjectUrl(s3Path);

				res.writeHead(200);
				res.end(
					JSON.stringify({
						url: publicUrl,
					})
				);
				return;
			});

			req.pipe(bb);
		} else {
			res.writeHead(404);
			res.end(JSON.stringify({ message: 'Endpoint not found' }));
		}
	})
	.listen(PORT);
