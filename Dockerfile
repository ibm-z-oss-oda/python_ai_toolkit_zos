FROM ubuntu:22.04

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN apt-get update -y \
    && DEBIAN_FRONTEND=noninteractive apt-get install build-essential curl git wget zip unzip -y \
    && mkdir pyai

RUN curl -sL https://deb.nodesource.com/setup_14.x -o setup_14.sh \
    && chmod +x setup_14.sh && ./setup_14.sh  && \
    apt update -y && apt install nodejs -y

WORKDIR pyai

COPY angular.json .
COPY .nvmrc .
COPY karma.conf.js .
COPY package-lock.json .
COPY package.json .
COPY src .
COPY tsconfig.app.json .
COPY tsconfig.json .
COPY tsconfig.spec.json .
COPY webassets/packageInfo.json . 
COPY webassets/shas.json  . 

RUN cp -r packageInfo.json src/assets/packageInfo.json
RUN cp -r shas.json src/assets/i18n/shas.json

EXPOSE 4000

RUN npm i -g @angular/cli && npm install
