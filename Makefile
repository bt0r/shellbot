#! /usr/bin/make -f
db-migrate:
	@echo 'Executing migrations files...'
	@docker-compose run node node ./node_modules/.bin/typeorm migration:run && echo '✅ Migrations' || echo '❌ Migrations failed'
install:
	@echo 'Installing dependencies...'
	@docker-compose down
	@docker-compose build
	@docker-compose run node npm install --only=dev
	$(MAKE) db-migrate
	@echo 'If its your first install, please run "make create-config"'
build:
	@echo 'Building javascript files from typescript.'
	@docker-compose run node npm run-script build && echo '✅ Build succeeded' || echo '❌ Build failed'
create-config: build
	@echo 'Creating the config file.'
	@chmod +x ./dist/Service/ConfigCreator.js
	@docker-compose run node node ./dist/Service/ConfigCreator.js
lint:
	@docker-compose run node ./node_modules/.bin/tslint -c tslint.json 'src/**/*.ts'
start: build
	@echo 'Starting the bot...'
	@docker-compose up -d && echo '✅ Bot started'
stop:
	@echo 'Stopping the bot...'
	@docker-compose down && echo '✅ Bot stopped !'
clean-docker:
	@echo 'Removing old shellbot node container'
	@docker rm -f shellbot-node
	@echo 'Removing old shellbot database container'
	@docker rm -f shellbot-db
