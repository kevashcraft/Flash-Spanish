default: dev

bash:
	docker-compose -p spanish_cards_dev run spanish_cards bash

build:
	docker-compose -p spanish_cards_dev build

build-no-cache:
	docker-compose -p spanish_cards_dev build --no-cache

dev: down build
	docker-compose -p spanish_cards_dev up

down:
	docker-compose -p spanish_cards_dev down -v

nc: build-no-cache
ncb: build-no-cache bash
ncd: build-no-cache dev
