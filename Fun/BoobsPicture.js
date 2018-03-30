let request = require('request');

module.exports = {
    name: "boobs",
    url: "http://api.oboobs.ru/boobs/1/1/random",
    fetchOne: function (message) {
        console.log('[Boobs] Fetching new booby picture')
        request(this.url, function (error, response, body) {
            let jsonResponse = JSON.parse(body);
            let boobsPicture = "http://media.oboobs.ru/"+jsonResponse[0].preview.replace("boobs_preview","boobs");
            let model = jsonResponse[0].model !== null ? jsonResponse[0].model : "";
            console.log('[Boobs] New boobs found ('+message.author.username+') : ' + boobsPicture);
            message.reply(model+" - "+boobsPicture);
        });
    }
};