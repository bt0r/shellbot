let request = require('request');
let htmlEntities = require('html-entities').AllHtmlEntities;
let entities = new htmlEntities();

module.exports = {
    name: "chuck",
    url: "https://chucknorrisfacts.fr/api/get?data=tri:alea;nb:1;type:txt",
    fetchOne: function (message) {
        console.log('[ChuckNorris] Fetching new fact')
        request(this.url, function (error, response, body) {
            let jsonResponse = JSON.parse(body);
            let fact = entities.decode(jsonResponse[0].fact);
            console.log('[ChuckNorris] New fact found : ' + fact);
            message.reply(fact);
        });
    }
};