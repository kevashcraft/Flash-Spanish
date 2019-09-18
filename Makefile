default: dev

bash: build_bash
	docker-compose -p flash_spanish_dev run bash bash

build_bash:
	docker-compose --verbose -p flash_spanish_dev build bash

build:
	docker-compose -p flash_spanish_dev build flash_spanish

dev: down build
	docker-compose -p flash_spanish_dev up flash_spanish

down:
	docker-compose -p flash_spanish_dev down -v

cordova_build:
	docker build -t flash_spanish_cordova -f Dockerfile.cordova .

cordova_bash:
	docker run \
            -it \
            -v $(shell pwd)/dist:/dist \
            -v $(shell pwd)/app:/app \
            -v $(shell pwd)/secret:/secret \
            -v $(shell pwd)/config.xml:/cordova/flash-spanish/config.xml \
            -e "keystore_pass=$(keystore_pass)" \
			flash_spanish_cordova bash

cordova: cordova_build
	docker run \
            -it \
            -v $(shell pwd)/dist:/dist \
            -v $(shell pwd)/secret:/secret \
            -v $(shell pwd)/config.xml:/cordova/flash-spanish/config.xml \
			flash_spanish_cordova bash -c "cordova build android \
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

install: prod_build prod_push
	helm install flash-spanish ./helm

upgrade: prod_build prod_push
	helm upgrade flash-spanish ./helm
