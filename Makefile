migrate:
	docker exec -it shellbot_node_1 ./node_modules/.bin/ts-node ./node_modules/.bin/typeorm migration:run
install:
	npm install
	npm install -g typescript ts-node
start:
	docker-compose up -d
