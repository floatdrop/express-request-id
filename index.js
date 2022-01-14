import {v4 as uuidv4} from 'uuid';

function generateV4UUID(_request) {
	return uuidv4();
}

const ATTRIBUTE_NAME = 'id';

export default function requestID({
	generator = generateV4UUID,
	headerName = 'X-Request-Id',
	setHeader = true,
} = {}) {
	return function (request, response, next) {
		const oldValue = request.get(headerName);
		const id = oldValue === undefined ? generator(request) : oldValue;

		if (setHeader) {
			response.set(headerName, id);
		}

		request[ATTRIBUTE_NAME] = id;

		next();
	};
}
