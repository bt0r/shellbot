migrate:
	docker exec -it shellbot_node_1 ./node_modules/.bin/ts-node ./node_modules/.bin/typeorm migration:run