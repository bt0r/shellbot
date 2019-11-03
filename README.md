[![CircleCI](https://circleci.com/gh/bt0r/shellbot.svg?style=svg)](https://circleci.com/gh/bt0r/shellbot)

# ShellBot
Shellbot is a discord bot of the shellcode.fr community, a french community about programming, devops, sysadmin and much more.

Want to improve this bot ? Feel free to create a pull request ! 

# [FR] ShellCode - Discord
Shellcode.fr est une communauté passionné par tout ce qui touche à l'informatique, on y parle administration système, réseaux, développement web & applicatif, scripting, sécurité etc...

L'objectif est de se retrouver autour d'une même passion afin de s'entraider/discuter/s'informer.

# Installation
## With docker
- Clone this repository `git clone git@github.com:bt0r/shellbot.git .`
- Run `make install`
- If it's your first install, please run `make create-config`, otherwise, don't forget to edit your config file (located on `config/config.yml`)
- 🎉 Start the bot `make start`

# Features
- **Chuck**: Show a random chuck norris fact (actually in french), command: `!chuck`
- **Weather**: Show the weather for a specific city, can be use for all the city around the world (OpenWeatherMap API), command: `!weather <city> <countryCode ISO2>`. Example: `!weather montreal ca`
- **Qwant**: Search a term on Qwant search engine, command : `!qwant <query>`
- **Cat**: Show a random cat picture, command : `!cat`
- **BonjourToutLeMonde**: Show the sexy "Bonjour" picture of the day, can be use randomly with `!bonjour` or with a specific term like "l'asiat":  `!bonjour l'asiat`
- **Butts/Boobs**: Show a random boob/butt picture, command: `!butts` or `!boobs`
- **Welcome message/Auto assign role**: When a user join the server, a welcome message is sent to him. The user can choose betweens multiple discord "reactions" to auto assign roles. Example: When clicking on 🔨 button, the user will be a handyman, with 📘 a writer etc.
- **Quote** : Allow a user to quote someone, usage: `!quote <messageId> <reply>` [/!\ Need to activate the discord developer mod](https://discordia.me/developer-mode)

# Contact
![](doc/images/discord.png) [shellcode](https://discord.gg/NDpZXN5)

![](doc/images/www.png) [shellCode.fr](https://shellcode.fr)

![](doc/images/twitter.png) [biiitor](https://twitter.com/biiitor)

![](doc/images/www.png) [btor.fr](https://btor.fr)

![](doc/images/twitch.png) [bt0r](https://twitch.tv/bt0r)
