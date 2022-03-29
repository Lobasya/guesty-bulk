const { urlConvertor } = require('../utils');
const { httpService } = require('../services');

const proxyMiddleware = async (req, res, next) => {
    try {
        const { endpoint, payload } = req.body;

        const listOfRequests = payload.map(data => {
            const { err } = httpService.rateLimitGateway(req.ip);

            if(err) {
                return Promise.reject({
                        status: err.code,
                        message: err.message
                    })
            }

            const url = urlConvertor(endpoint.url, data.pathParams);

            return httpService.requestWithRetry(
                url,
                {
                    method: endpoint.method,
                    body: data.body,
                    headers: data.headers,
                }
            )
        });

        const listOfResponses = await Promise.allSettled(listOfRequests);

        res.json(listOfResponses.map(responseItem => {
            if(responseItem.status === 'fulfilled') {
                return responseItem.value;
            }
            return responseItem.reason;
        }))
    } catch (err) {
        next(err);
    }
}

module.exports = proxyMiddleware;
