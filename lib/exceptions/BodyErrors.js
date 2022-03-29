class BadRequest extends Error {
    constructor(msg) {
        super(msg);
        this.name = 'BadRequest';
        this.code = 400;
        this.message = msg;
    }
}

module.exports = {
    BadRequest,
}
