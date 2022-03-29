class DBFactory {
    constructor() {
        this.collections = new Map();
    }

    createCollection(name) {
        return this.collections
            .set(name, new Map())
            .get(name);
    }
}

module.exports = new DBFactory();
