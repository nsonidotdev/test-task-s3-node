import urlMod from 'url';
import { allowedMimes, fileSizeLimit } from './constants.js';

export const getS3PublicObjectUrl = (key) => {
	return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${key}`;
};

export const validateFile = (file, fileType) => {
	if (file.length > fileSizeLimit) {
		return {
			valid: false,
			message: 'File too large',
			code: 413
		};
	}

	if (!allowedMimes.includes(fileType)) {
		return {
			valid: false,
			message: `This file type is not supported`,
			code: 400
		};
	}

	return {
		valid: true,
	};
};

export const matchEndpointName = (routes, method, url) => {
	const { pathname, query } = urlMod.parse(url, true);

	const formattedEnpointName = `${method}:${pathname}`;

	if (routes[formattedEnpointName]) {
		return {
			handler: routes[formattedEnpointName],
			params: {},
			query,
		};
	}

	for (const [route, handler] of Object.entries(routes)) {
		const [routeMethod, ...routeSegments] = route.split(':');
		const routePath = routeSegments.join(':');
		if (method !== routeMethod) continue;

		const paramNames = [];
		const regexPath = routePath.replace(/:[^/]+/g, (match) => {
			paramNames.push(match.slice(1));
			return '([^/]+)';
		});

		const routeRegex = new RegExp(`^${regexPath}$`);
		const match = pathname.match(routeRegex);

		if (match) {
			const params = {};
			paramNames.forEach((name, index) => {
				params[name] = match[index + 1];
			});

			return {
				handler,
				params,
				query,
			};
		}
	}

	return null;
};
