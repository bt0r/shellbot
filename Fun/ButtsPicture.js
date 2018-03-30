let request = require('request');

module.exports = {
    name: "butts",
    url: "http://api.obutts.ru/butts/1/1/random",
    fetchOne: function (message) {
        console.log('[Boobs] Fetching new butts picture')
        request(this.url, function (error, response, body) {
            let jsonResponse = JSON.parse(body);
            let buttsPicture = "http://media.obutts.ru/"+jsonResponse[0].preview.replace("butts_preview","butts");
            let model = jsonResponse[0].model !== null ? jsonResponse[0].model : "";
            console.log('[Boobs] New butts found ('+message.author.username+') : ' + buttsPicture);
            message.reply(model+" - "+buttsPicture);
        });
    }
};