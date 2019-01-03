#! /usr/bin/make -f
USE_DOCKER="Y" # Change it to "N" if you don't want to use docker

migrate:
	@echo 'Executing migrations files...'
	@if [ $(USE_DOCKER) = "Y" ]; then docker exec -it shellbot_node_1 node ./node_modules/.bin/typeorm migration:run; fi
	@if [ $(USE_DOCKER) != "Y" ]; then node ./node_modules/.bin/typeorm migration:run ; fi
install:
	@echo 'Installing dependencies...'
	npm install
	@if [ $(USE_DOCKER) != "Y" ]; then npm install -g typescript; fi
build:
	@echo 'Buildind javascript files from typescript.'
	@npm run-script build && echo '✅ Build succeeded' || echo '❌ Build failed'
create-config: build
	@echo 'Creating the config file.'
	node dist/Service/ConfigCreator.js
start:
	@echo 'Starting the bot...'
	@if [ $(USE_DOCKER) = "Y" ]; then docker-compose up -d && echo '✅ Bot started'; else npm start && echo '✅ Bot started' || echo '❌ Cannot start the bot'; fi
stop:
	@echo 'Stopping the bot...'
	@if [ $(USE_DOCKER) = "Y" ]; then docker-compose down && echo '✅ Bot stopped !' || echo '❌ Error when trying to stop the bot' ; else @echo '❌ You should stop the bot by yourself'; fi
