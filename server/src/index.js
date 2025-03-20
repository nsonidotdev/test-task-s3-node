import 'dotenv/config';
import { S3Client } from '@aws-sdk/client-s3';
import http from 'http';
import {  matchEndpointName } from './utils.js';
import { routes } from './router/index.js';

export const s3Client = new S3Client({
	region: process.env.AWS_S3_REGION,
	credentials: {
		accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
	},
});

const PORT = process.env.PORT ?? 3000;

const server = http
	.createServer(async (req, res) => {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader(
			'Access-Control-Allow-Methods',
			'GET, POST, PUT, DELETE, OPTIONS'
		);
		res.setHeader("Access-Control-Allow-Headers", 'Content-Type, X-File-Name')
		

		if (req.method === "OPTIONS") {
			return res.end();
		}
		
		const match = matchEndpointName(routes, req.method, req.url);

		if (!match) {
			res.writeHead(404);
			res.end(JSON.stringify({ message: 'Endpoint not found' }));
			return;
		}

		req.params = match.params;
		req.query = match.query;
		await match.handler(req, res);
	})
	.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
