#! /usr/bin/make -f
USE_DOCKER="Y"

migrate:
	docker exec -it shellbot_node_1 ./node_modules/.bin/ts-node ./node_modules/.bin/typeorm migration:run
install:
	npm install
	npm install -g typescript ts-node
start:
	@if [ $(USE_DOCKER) = "Y" ]; then docker-compose up -d; else npm start; fi
stop:
	@if [ $(USE_DOCKER) = "Y" ]; then docker-compose down; else echo "You should stop the bot by yourself"; fi
