import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../index.js';

export const handleDeleteObject = async (req, res) => {
	const key = decodeURIComponent(req.params.key);
    
	try {
		const deleteCommand = new DeleteObjectCommand({
			Bucket: process.env.AWS_S3_BUCKET_NAME,
			Key: key,
		});
		const deleteResponse = await s3Client.send(deleteCommand);
        console.log('DELETE RESPONSE', deleteResponse)

		res.writeHead(200);
		res.end(JSON.stringify({ message: 'Delete successful' }));
	} catch (error) {
        res.writeHead(400);
		res.end(JSON.stringify({ message: 'Error deleting an object' }));
    }
};
