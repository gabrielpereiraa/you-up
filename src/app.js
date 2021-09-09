const express = require('express');
const helmet = require('helmet');

class ApplicationClass{

    constructor(){
        this.express = express();
        this.middlewares();
        this.routes();
    }

    middlewares(){
        this.express.use(express.json());
        this.express.use(helmet());
    }

    routes(){
        this.express.use('/', require('./routes/index'));
    }
}

module.exports = new ApplicationClass().express;