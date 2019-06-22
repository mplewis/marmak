FROM ubuntu:18.04
WORKDIR /build

# https://serverfault.com/a/846989/319473
RUN ln -fs /usr/share/zoneinfo/America/Denver /etc/localtime

# Install PlatformIO and AWS CLI
RUN apt-get update
RUN apt-get install -y python2.7 python-pip tzdata
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

# Copy needed files and set the run script
COPY scripts /scripts
WORKDIR /scripts
CMD /scripts/run.sh
