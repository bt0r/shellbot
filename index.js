// Load config file
YAML = require('yamljs');
config = YAML.load('config/config.yml');
const chuckNorris = require('./Fun/ChuckNorris');
const buttsPicture = require('./Fun/ButtsPicture');
const boobsPicture = require('./Fun/BoobsPicture');
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log('[ShellBot] Connected');
});

client.on('message', message => {
    // Prevent message from the bot
    if(message.author.id !== client.user.id){
        let channel = message.channel;
        let channelConfig = config.channels[channel.name+"_"+channel.position];
        // Check if message is posted in a restricted channel
        if(channelConfig !== undefined){
            let messageRestriction = channelConfig.message_restriction;
            if(messageRestriction !== undefined && messageRestriction.regexp !== null && messageRestriction.error_message !== null){
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

            // Modules
            let modulesEnabled = channelConfig.modules_enabled;
            if(modulesEnabled !== null && message.content.startsWith(config.parameters.commandPrefix)){
                let messageContent = message.content.split(config.parameters.commandPrefix)[1];
                // Chucks
                if(modulesEnabled.chuckNorris && messageContent == chuckNorris.name){
                    chuckNorris.fetchOne(message);
                }
                // Boobs & Butts
                if(modulesEnabled.buttsPicture && messageContent == buttsPicture.name){
                    buttsPicture.fetchOne(message);
                }
                if(modulesEnabled.boobsPicture && messageContent == boobsPicture.name){
                    boobsPicture.fetchOne(message);
                }
            }
        }
    }

});

client.login(config.parameters.token);