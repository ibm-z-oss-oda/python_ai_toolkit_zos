FROM ubuntu:22.04

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN apt-get update -y \
    && DEBIAN_FRONTEND=noninteractive apt-get install build-essential curl git wget -y

COPY angular.json .
COPY dist .
COPY karma.conf.js .
COPY node_modules .
COPY package-lock.json .
COPY package.json .
COPY src .
COPY tsconfig.app.json
COPY tsconfig.json .
COPY tsconfig.spec.json .
COPY webassets/packageInfo.json src/assets/packageInfo.json
COPY webassets/shas.json src/assets/i18n/shas.json

EXPOSE 4000

RUN wget https://chromedriver.storage.googleapis.com/99.0.4844.17/chromedriver_linux64.zip \
    && unzip -d /tmp/ chromedriver_linux64.zip

RUN cd pyai && curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash \
    && export NVM_DIR="$HOME/.nvm" && \
    source $NVM_DIR/nvm.sh \
    && nvm install && nvm use && npm install && ng add angular-cli-ghpages
