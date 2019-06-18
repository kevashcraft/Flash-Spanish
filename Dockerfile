FROM node:12.3.1-stretch

RUN npm i -g @vue/cli cordova

RUN \
apt-get update && \
apt-get install -y default-jdk-headless gradle android-sdk
#  && rm -rf /var/lib/apt/lists/*

RUN cd /tmp && \
  git clone https://github.com/Shadowstyler/android-sdk-licenses.git && \
  cp -a android-sdk-licenses/*-license /usr/lib/android-sdk/licenses && \
  rm -rf android-sdk-licenses

RUN mkdir -p /app
WORKDIR /app

ADD app /app

RUN npm i

CMD ["npm", "run", "serve"]
