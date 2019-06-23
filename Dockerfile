FROM ubuntu:18.04
WORKDIR /build

# https://serverfault.com/a/846989/319473
RUN ln -fs /usr/share/zoneinfo/America/Denver /etc/localtime

# Install Python
RUN apt-get update
RUN apt-get install -y python2.7 python-pip

# Install Node.js 12 and Yarn
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash
RUN apt-get install -y nodejs
RUN npm install --global yarn

# Install PlatformIO and AWS CLI
RUN pip install -U awscli
# RUN pip install -U platformio

# # Install AtmelAVR and U8glib
# RUN mkdir -p /build/lib
# RUN mkdir -p /build/src
# COPY cache_helpers/platformio.ini /build
# RUN platformio platform install atmelavr
# RUN platformio lib install 7

# # Add TH3D Marlin source
# COPY TH3D-Unified-U1.R2/TH3DUF_R2 /build/src

# # First run: installing Arduino framework, caching most built files
# COPY cache_helpers/Configuration.h /build/src
# RUN platformio run

# # Cleanup files used as params for the real run
# RUN rm /build/src/Configuration.h /build/platformio.ini

# Where the magic happens
RUN mkdir /scripts
WORKDIR /scripts

# Install Node dependencies
COPY scripts/package.json /scripts/package.json
COPY scripts/yarn.lock /scripts/yarn.lock
RUN yarn install

# Copy everything else
COPY scripts /scripts

CMD yarn start
