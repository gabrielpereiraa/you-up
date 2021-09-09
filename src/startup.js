const config = require('config');
var moment = require('moment-timezone');

module.exports = function(){

    const smtpOptions = config.get('smtpOptions');

    if(!smtpOptions.host) throw new Error('smtpOptions: host is not defined.');

    if(!smtpOptions.port) throw new Error('smtpOptions: port is not defined.');

    if(smtpOptions.secure == "") throw new Error('smtpOptions: secure is not defined.');

    if(!smtpOptions.auth.user) throw new Error('smtpOptions: auth.user is not defined.');

    if(!smtpOptions.auth.pass) throw new Error('smtpOptions: auth.pass is not defined.');

    if(!config.get('jwtPrivateKey')) throw new Error('jwtPrivateKey is not defined.');

    if(!config.get('DB_HOST')) throw new Error('DB_HOST is not defined.');

    moment.locale('pt-BR');
}