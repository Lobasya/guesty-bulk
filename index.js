const express = require('express');
const { bodyValidatorMiddleware, proxyMiddleware } = require("./lib/middlewares");
const PORT = process.env.PORT || 8080;
const { errorTypes } = require('./lib/exceptions');

const app = express();

app.use(express.json());

app.post('/bulk', bodyValidatorMiddleware, proxyMiddleware);

app.use((err, req, res, next) => {
    if(err) {
        if(err.name in errorTypes) {
            res.status(err.code).json({message: err.message})
            return
        }
        res.status(500).json({message: 'Internal server error!'})
    }
})

app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
});
