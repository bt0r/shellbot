#! /usr/bin/make -f
USE_DOCKER="Y" # Change it to "N" if you don't want to use docker

migrate:
	$(info Executing migrations files...)
	@if [ $(USE_DOCKER) = "Y" ]; then docker exec -it shellbot_node_1 node ./node_modules/.bin/typeorm migration:run; fi
	@if [ $(USE_DOCKER) != "Y" ]; then node ./node_modules/.bin/typeorm migration:run ; fi
install:
	$(info Installing dependencies...)
	npm install
	@if [ $(USE_DOCKER) != "Y" ]; then npm install -g typescript; fi
build:
	$(info Buildind javascript files from typescript.)
	@npm run-script build
start:
	$(info Starting the bot...)
	@if [ $(USE_DOCKER) = "Y" ]; then docker-compose up -d; else npm start; fi
stop:
	$(info Stopping the bot...)
	@if [ $(USE_DOCKER) = "Y" ]; then docker-compose down && $(info Bot stopped !); else $(error You should stop the bot by yourself); fi
