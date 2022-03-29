class RateLimitError extends Error {
    constructor(msg) {
        super(msg);
        this.name = 'RateLimit';
        this.code = 429;
        this.message = msg;
    }
}

module.exports = {
    RateLimitError,
}
