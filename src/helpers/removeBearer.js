module.exports = function(authToken){
    return authToken.substring(7, authToken.length);
}