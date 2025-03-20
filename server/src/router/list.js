import url from 'url';
import { HeadObjectCommand, ListObjectsCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../index.js';
import { getS3PublicObjectUrl } from '../utils.js';

export const handleList = async (req, res) => {
	const { query } = url.parse(req.url, true);

	const count = Number.isNaN(Number(query.c)) ? 10 : Number(query.c);

	const command = new ListObjectsCommand({
		Bucket: process.env.AWS_S3_BUCKET_NAME,
		MaxKeys: count,
	});

	let S3Objects = [];

	try {
		const listedObjects = await s3Client.send(command);
		if (!listedObjects.Contents.length) {
			res.writeHead(200);
			res.end(
				JSON.stringify({
					objects: [],
				})
			);
			return;
		}

		S3Objects = listedObjects.Contents;
	} catch (e) {
		res.writeHead(500);
		res.end(
			JSON.stringify({
				message: 'Unable to get files',
			})
		);
		return;
	}

	const promises = S3Objects.map(async (obj) => {
		const key = obj.Key;
		const lastModified = obj.LastModified;
		const size = obj.Size;
		let metadata = null;

		try {
			const headCommand = new HeadObjectCommand({
				Bucket: process.env.AWS_S3_BUCKET_NAME,
				Key: key,
			});
			const objectHead = await s3Client.send(headCommand);
			metadata = objectHead.Metadata;
		} catch (error) {
			console.error(`ERROR fetching OBJECT HEAD for object with key: ${key}`);
		}

		return {
			key,
			size,
			lastModified: lastModified.toString(),
			meta: metadata,
			url: getS3PublicObjectUrl(key),
		};
	});

	const objects = await Promise.all(promises);

	res.writeHead(200);
	res.end(JSON.stringify({ objects }));
};
