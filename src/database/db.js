const mongoose = require('mongoose');
const config = require('config');

mongoose.Promise = global.Promise;

mongoose.connect(config.get('DB_HOST'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    user: config.get('DB_USER'),
    pass: config.get('DB_PASS')
}).then(() => {
    console.log('MongoDB: Connected.');
}).catch((err) =>{
    console.log(err);
});

module.exports = mongoose;