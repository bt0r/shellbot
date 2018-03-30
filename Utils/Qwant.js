let request = require("request");
var striptags = require('striptags');

module.exports = {
    name: "qwant",
    url: "https://api.qwant.com/api/search/web?count=10&",
    userAgent: "Mozilla/5.0 (Windows NT 6.3; WOW64; rv:56.0) Gecko/20100101 Firefox/56.0",
    search: function (message) {

        let messageContent = message.content.split(" ");
        console.log(messageContent);
        messageContent.shift();
        if(messageContent!== undefined && messageContent !== ""){
            console.log('[Qwant] Search query ' + messageContent + ' from ' + message.author.username);
            let url = this.url + "q=" + messageContent;
            console.log(url);
            let options = {
                url: url,
                method: "GET",
                headers: { "User-Agent": this.userAgent }
            };
            request(options, function (error, response, body) {
                let jsonResponse = JSON.parse(body);
                let result = jsonResponse.data.result.items;
                let resultContent = "";
                for(let i=0;i<result.length;i++){
                    let link = result[i].url;
                    let title = striptags(result[i].title);
                    let content = "**"+title+"**\n<"+link+">";
                    resultContent += "\n"+content;
                }
                message.reply(resultContent);
            });
        }
    }
};