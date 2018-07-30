# ShellBot
Shellbot is a discord bot of the shellcode.fr community, want to improve this bot ? Just create a pull-request ! 

# [FR] ShellCode - Discord
Shellcode.fr est une communauté passionné par tout ce qui touche à l'informatique, on y parle administration système, réseaux, développement web & applicatif, scripting, sécurité etc...

L'objectif est de se retrouver autour d'une même passion afin de s'entraider/discuter/s'informer.

# How to install it
#### Clone it `git clone https://github.com/bt0r/shellbot.git`

#### Npm it 
```SHELL 
npm install
npm install -g typescript ts-node tslint
```

#### Edit it `config/config.yml` (based on `config.yml.dist`)


Launch it `ts-node index.ts`

That's it ! 😎

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
[ShellCode Discord](https://discord.gg/NDpZXN5)

[ShellCode.fr](https://shellcode.fr)

[Twitter](https://twitter.com/biiitor)

[btor.fr](https://btor.fr)

[Twitch](https://twitch.tv/bt0r)