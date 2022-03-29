const {BadRequest} = require("../exceptions");


const urlConvertor = (url, pathParams) => {
    let resultUrl = url;
    url.replace(/{(\w+)}/gi, (match, param) => {
        const pathParamValue = pathParams[param];
        if(!pathParamValue) {
            throw new BadRequest(`Missed param ${param} in payload.pathParams`);
        }
        resultUrl = resultUrl.replace(match, pathParamValue);
    });
    return resultUrl;
}

module.exports = urlConvertor;
