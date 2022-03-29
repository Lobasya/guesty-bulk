const db = require('./DBFactory');

class RateLimitModel {
    #db = null;
    constructor() {
        this.#db = db.createCollection('rateLimit');
    }

    getItem(ip) {
        return this.#db.get(ip) ?? null;
    }

    setItem(ip, data) {
        this.#db.set(ip, data);
    }
}

module.exports = new RateLimitModel();
