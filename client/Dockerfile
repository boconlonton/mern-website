FROM node:16-alpine

RUN apk update && apk add bash

WORKDIR /usr/src/client-app

COPY package.json .

RUN npm install --legacy-peer-deps

ADD . /usr/src/client-app