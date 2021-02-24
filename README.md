[![CircleCI](https://circleci.com/gh/bt0r/shellbot.svg?style=svg)](https://circleci.com/gh/bt0r/shellbot)

# ShellBot
Shellbot is a discord bot of the shellcode.fr community, a french community about programming, devops, sysadmin and much more.

Want to improve this bot ? Feel free to create a pull request ! 

# [FR] ShellCode - Discord
Shellcode.fr est une communauté passionné par tout ce qui touche à l'informatique, on y parle administration système, réseaux, développement web & applicatif, scripting, sécurité etc...

L'objectif est de se retrouver autour d'une même passion afin de s'entraider/discuter/s'informer.

# Installation
- Clone this repository `git clone git@github.com:bt0r/shellbot.git .`
- Run `make install`
- If it's your first install, please run `make create-config`, otherwise, don't forget to edit your config file (located on `config/config.yml`)
- 🎉 Start the bot `make start`

# Production environment
## First way, dedicated server
You can run the bot on a "classical" dedicated server by installing:
- Mysql/MariaDB server
- Node/NPM

When your server is well configured, just run the bot by using native node command: 
- Install dependencies `npm install`
- Run SQL migrations  `node ./node_modules/.bin/typeorm migration:run`
- Build the javascript files `npm run-script build`
- Start the bot `npm start`

## Second way, Kubernetes
You must have a kubernetes cluster (managed or self-hosted), i personally use [k3s](https://k3s.io/).
All the kubernetes resources are available in the `infra` directory, all you have to do is:
- Build your docker image and push it to your docker registry
- Edit the kubernetes resources to pull the right image
- Create 2 kubernetes secret:
  - One secret called `docker-credential` with your docker credential (or rename it by your current docker credential secret)
  - One secret called `mysql-credential` which is base on `.env.prod.dist` file with your database credential

# Features
- **Chuck**: Show a random chuck norris fact (currently only in french, see https://github.com/bt0r/shellbot/issues/28), command: `!chuck`
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
