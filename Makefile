#! /usr/bin/make -f
USE_DOCKER="Y" # Change it to "N" if you don't want to use docker

migrate:
	@if [ $(USE_DOCKER) = "Y" ]; then docker exec -it shellbot_node_1 ./node_modules/.bin/ts-node ./node_modules/.bin/typeorm migration:run; fi
	@if [ $(USE_DOCKER) != "Y" ]; then ts-node ./node_modules/.bin/typeorm migration:run ; fi
install:
	npm install
	@if [ $(USE_DOCKER) != "Y" ]; then npm install -g typescript ts-node; fi
start:
	@if [ $(USE_DOCKER) = "Y" ]; then docker-compose up -d; else npm start; fi
stop:
	@if [ $(USE_DOCKER) = "Y" ]; then docker-compose down; else echo "You should stop the bot by yourself"; fi
