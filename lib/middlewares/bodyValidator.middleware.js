const { BadRequest } = require('../exceptions');
const http = require('http');

const urlRegExp = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");

class BodyValidator {
    static checkUrl(url) {
        const result = {
            isValid: true,
            message: 'ok'
        };

        if(!url && url instanceof String) {
            result.isValid = false;
            result.message = 'No url provided';
            return result;
        }

        if(!urlRegExp.test(url)) {
            result.isValid = false;
            result.message = 'Invalid url format';
            return result;
        }
        return result;
    }

    static checkMethod(method) {
        const result = {
            isValid: true,
            message: 'ok'
        };

        if(!method && method instanceof String) {
            result.isValid = false;
            result.message = 'No method provided';
            return result;
        }

        if(!http.METHODS.includes(method.toUpperCase())) {
            result.isValid = false;
            result.message = 'Invalid method';
            return result;
        }
        return result;
    }

    static checkEndpoint(endpoint) {
        const result = {
            isValid: true,
            message: 'ok'
        };
        if(!endpoint) {
            result.isValid = false;
            result.message = 'No endpoint provided';
            return result;
        }

        const urlValidator = BodyValidator.checkUrl(endpoint.url);
        if(!urlValidator.isValid) {
            result.isValid = false;
            result.message = urlValidator.message;
            return result;
        }

        const methodValidator = BodyValidator.checkMethod(endpoint.method);
        if(!methodValidator.isValid) {
            result.isValid = false;
            result.message = methodValidator.message;
            return result;
        }
        return result;
    }


    static payloadValidator(payload) {
        const result = {
            isValid: true,
            message: 'ok'
        };

        if(!payload) {
            result.isValid = false;
            result.message = 'Invalid payload';
            return result;
        }

        if(!Array.isArray(payload)) {
            result.isValid = false;
            result.message = 'Invalid payload';
            return result;
        }
        return result;
    }
}



const bodyValidatorMiddleware = (req, res, next) => {
    const { endpoint, payload } = req.body;

    const endpointValidator = BodyValidator.checkEndpoint(endpoint);
    if(!endpointValidator.isValid) {
        return next(new BadRequest(endpointValidator.message));
    }

    const payloadValidator = BodyValidator.payloadValidator(payload);
    if(!payloadValidator.isValid) {
        return next(new BadRequest(payloadValidator.message));
    }

    next();
}

module.exports = bodyValidatorMiddleware;
