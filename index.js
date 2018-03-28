// Load config file
YAML = require('yamljs');
config = YAML.load('config/config.yml');
const chuckNorris = require('./Fun/ChuckNorris');
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log('[ShellBot] Connected');
});

client.on('message', message => {
    // Prevent message from the bot
    if(message.author.id !== client.user.id){
        let channel = message.channel;
        let restrictedChannel = config.channels[channel.name+"_"+channel.position];
        // Check if message is posted in a restricted channel
        if(restrictedChannel !== null){
            let messageRestriction = restrictedChannel.message_restriction;
            if(messageRestriction.regexp !== null && messageRestriction.error_message !== null){
                // If message is forbidden, remove it
                if(!message.content.match(messageRestriction.regexp)){
                    message.delete();
                    message.reply(messageRestriction.error_message).then(function(messageSent){
                        setTimeout(function(){
                            // Remove warning message after 10 seconds
                            messageSent.delete();
                        },10000);
                    });

                }
            }
        }

        // Modules
        let modulesEnabled = restrictedChannel.modules_enabled;
        if(restrictedChannel !== null && modulesEnabled!== null && message.content.startsWith(config.parameters.commandPrefix)){
            if(modulesEnabled.chuckNorris && message.content == chuckNorris.name){
                chuckNorris.fetchOne(message);
            }
        }
    }

});

client.login(config.parameters.token);