import url from 'url';
import {
    HeadObjectCommand,
	ListObjectsCommand,
} from '@aws-sdk/client-s3';
import { s3Client } from '../index.js';
import { getS3PublicObjectUrl } from '../utils.js';

export const handleListObjects = async (req, res) => {
	const { query } = url.parse(req.url, true);

	const count = Number.isNaN(Number(query.c)) ? 10 : Number(query.c);

	const command = new ListObjectsCommand({
		Bucket: process.env.AWS_S3_BUCKET_NAME,
		MaxKeys: count,
	});

	const listedObjects = await s3Client.send(command);
	if (!listedObjects.Contents.length) {
		res.writeHead(200);
		res.end({
			objects: [],
		});
		return;
	}

	const promises = listedObjects.Contents.map(async (item) => {
		const key = item.Key;
		const lastModified = item.LastModified;
		const size = item.Size;

		const headCommand = new HeadObjectCommand({
			Bucket: process.env.AWS_S3_BUCKET_NAME,
			Key: key,
		});
		const objectHead = await s3Client.send(headCommand);

		return {
			key,
			size,
			lastModified: lastModified.toString(),
			meta: objectHead.Metadata,
            url: getS3PublicObjectUrl(key)
		};
	});

	const objects = await Promise.all(promises);

	res.writeHead(200);
	res.end(JSON.stringify(objects));
};
