default: dev

bash:
	docker-compose -p flash_spanish_dev run flash_spanish bash

build:
	docker-compose -p flash_spanish_dev build

build-no-cache:
	docker-compose -p flash_spanish_dev build --no-cache

dev: down build
	docker-compose -p flash_spanish_dev up

down:
	docker-compose -p flash_spanish_dev down -v

prod_build:
	docker build -f Dockerfile.prod -t kevashcraft/flash-spanish:latest .

prod_push: prod_build
	docker push kevashcraft/flash-spanish:latest

upgrade: prod_build prod_push
	helm upgrade flash-spanish ./helm --recreate-pods

nc: build-no-cache
ncb: build-no-cache bash
ncd: build-no-cache dev
