const app = require('./app'); //main class
const startup = require('./startup')(); //check environment variables
const db = require('./database/db'); //db connection
const config = require('config'); //get config variables

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(` ENV: ${config.util.getEnv('NODE_ENV')} \n PORT: ${port}`));

module.exports = server;