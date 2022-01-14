import {v4 as uuidv4} from 'uuid';

function generateV4UUID(_request) {
	return uuidv4();
}

export default function requestID({
	attributeName = 'id',
	generator = generateV4UUID,
	headerName = 'X-Request-Id',
} = {}) {
	return function (request, response, next) {
		const id = generator(request);

		if (headerName !== false && request.headers[headerName] === undefined) {
			response.setHeader(headerName, id);
		}

		if (attributeName !== false) {
			request[attributeName] = id;
		}

		next();
	};
}
