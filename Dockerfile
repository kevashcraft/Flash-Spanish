FROM node:12.3.1-stretch

RUN npm i -g @vue/cli cordova

RUN mkdir -p /app
WORKDIR /app

ADD app /app

RUN npm i

CMD ["npm", "run", "serve"]
