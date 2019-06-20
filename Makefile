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

cordova_bash_build:
	docker build -t flash_spanish_cordova -f Dockerfile.cordova .

cordova_bash:
	docker run \
            -it \
            -v $(shell pwd)/dist:/dist \
            -v $(shell pwd)/secret:/secret \
            -v $(shell pwd)/config.xml:/cordova/flash-spanish/config.xml \
            -e "keystore_pass=$(keystore_pass)" \
			flash_spanish_cordova bash

cordova_build:
	docker run \
            -it \
            -v $(shell pwd)/dist:/dist \
            -v $(shell pwd)/secret:/secret \
            -v $(shell pwd)/config.xml:/cordova/flash-spanish/config.xml \
			flash_spanish_cordova bash -c "cp www/favicon.ico www/icon.png && cordova build android \
			--release \
			-- \
			--keystore /secret/kevapps.pfx \
			--alias kevapps_one \
			--storePassword=$(keystore_pass) \
			--password=$(keystore_pass) && \
			cp /cordova/flash-spanish/platforms/android/app/build/outputs/apk/release/app-release.apk /dist/app-release.apk"

prod_build:
	docker build -f Dockerfile.prod -t kevashcraft/flash-spanish:latest .

prod_push: prod_build
	docker push kevashcraft/flash-spanish:latest

upgrade: prod_build prod_push
	helm upgrade flash-spanish ./helm --recreate-pods

nc: build-no-cache
ncb: build-no-cache bash
ncd: build-no-cache dev
