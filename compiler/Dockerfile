FROM ubuntu:18.04
WORKDIR /build

# https://serverfault.com/a/846989/319473
RUN ln -fs /usr/share/zoneinfo/America/Denver /etc/localtime

RUN apt-get update
RUN apt-get install -y curl python2.7 python-pip
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash
RUN apt-get install -y nodejs
RUN npm install --global yarn
RUN pip install -U awscli platformio

RUN mkdir -p /build/lib
RUN mkdir -p /build/src

RUN platformio platform install atmelavr
# U8glib
RUN platformio lib --global install 7

COPY TH3D-Unified-U1.R2/TH3DUF_R2 /build/src

# First run: installing Arduino framework, caching most built files
COPY cache_helpers/platformio.ini /build
COPY cache_helpers/Configuration.h /build/src
RUN platformio run
# Cleanup files used as params for the real run
RUN rm /build/src/Configuration.h /build/platformio.ini

RUN mkdir /server
WORKDIR /server

COPY server/package.json .
COPY server/yarn.lock .
RUN yarn install

COPY server /server
RUN yarn compile

ENTRYPOINT ["yarn"]
CMD ["start"]
