const https = require('https');
const { rateLimitModel } = require('../repositories');
const { RateLimitError} = require("../exceptions");
const { rateLimit } = require('../config');

class HttpService {
    request(url, options) {

        const urlObject = new URL(url);
        const requestOptions = {
            hostname: urlObject.hostname,
            path: urlObject.pathname,
            search: urlObject.search,
            protocol: urlObject.protocol,
            method: options.method ? options.method.toUpperCase() : 'GET',
            headers: options.headers || {},
        };

        if(options.method !== 'GET' && options.body && (typeof options.body === 'object')) {
            Object.assign(requestOptions.headers, {
                'Content-Type': 'application/json',
                'Content-Length': JSON.stringify(options.body).length,
            })
        }

        return new Promise((resolve, reject) => {
            const req = https.request(requestOptions, res => {
                const responseData = {
                    status: res.statusCode,
                    responseHeader: res.headers,
                    data: [],
                }

                res.on('data', chunk => {
                    responseData.data.push(chunk.toString());
                })

                res.on('end', () => {
                    if(res.headers['content-type'] && res.headers['content-type'].includes('application/json')) {
                        responseData.data = JSON.parse(responseData.data);
                    } else {
                        responseData.data = responseData.data.toString();
                    }
                    if(responseData.status < 300) {
                        resolve(responseData);
                    } else {
                        reject(responseData);
                    }
                    return;
                })
            })

            req.on('error', error => {
                reject(error);
            })

            if(options.body) {
                if(typeof options.body === 'object') {
                    req.write(JSON.stringify(options.body));
                } else {
                    req.write(options.body);
                }
            }

            req.end()
        })
    }

    async requestWithRetry(...args) {
        try {
            return await this.request(...args);
        } catch (err) {
            if (err.status === 503) {
                return this.request(...args);
            }
            throw err;
        }
    }

    rateLimitGateway(ip) {
        const data = rateLimitModel.getItem(ip) || [];

        const setTimeStamp = () => {
            data.push(new Date().getTime());
            rateLimitModel.setItem(ip, data);
        }

        if(data.length < rateLimit.maxRequests) {
            setTimeStamp();
            return {
                status: 'approved',
                err: null,
            };
        }

        data.shift();
        data.push(new Date().getTime());

        const lastTimeStamp = data[data.length - 1];
        const firstTimeStamp = data[0];

        const durationBetweenRequest = Math.round((lastTimeStamp - firstTimeStamp) / 1000);

        if(durationBetweenRequest <= rateLimit.duration) {
            return {
                status: 'rejected',
                err: new RateLimitError(`You have exceeded the ${rateLimit.maxRequests} requests in ${rateLimit.duration} seconds limit!`)
            };
        }

        return {
            status: 'approved',
            err: null,
        };
    }
}

module.exports = new HttpService();

