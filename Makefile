default: dev

bash:
	docker-compose -p spanish_flash_dev run spanish_flash bash

build:
	docker-compose -p spanish_flash_dev build

build-no-cache:
	docker-compose -p spanish_flash_dev build --no-cache

dev: down build
	docker-compose -p spanish_flash_dev up

down:
	docker-compose -p spanish_flash_dev down -v

prod_build:
	docker build -f Dockerfile.prod -t kevashcraft/spanish-flash-kevapps:latest .

prod_push:
	docker push kevashcraft/spanish-flash-kevapps:latest

upgrade: prod_build prod_push
	helm upgrade spanish-flash ./helm --recreate-pods

nc: build-no-cache
ncb: build-no-cache bash
ncd: build-no-cache dev
