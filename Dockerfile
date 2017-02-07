FROM       nodesource/precise:6.3.0
MAINTAINER Jonathan Barnett (jonathan.barnett@news.com.au)

ENV ETS_VER     akamai-ets_6.0.0.4_Ubuntu
ENV ETS_DIR     /opt/akamai-ets

ENV NODE_DIR    /usr/src/app/
ENV HTTPD_DIR   /usr/local/apache2
ENV PATH        $HTTPD_DIR/bin:$PATH

RUN mkdir -p "$HTTPD_DIR" \
	&& chown www-data:www-data "$HTTPD_DIR"

# install default packages required to make
# ets-server work correctly ensuring i386
# support is enabled

RUN echo "foreign-architecture i386" > /etc/dpkg/dpkg.cfg.d/multiarch && \
    DEBIAN_FRONTEND=noninteractive apt-get update && apt-get install -yq --no-install-recommends \

    curl \
    libtime-duration-perl \
    nano \

    libc6:i386 \
    libexpat1:i386 \
    libssl1.0.0:i386 \
    libstdc++6:i386 \
    zlibc:i386

# install ets server directly bypassing default
# installation

COPY files/release/${ETS_VER}.tar.gz /tmp

RUN  tar -xzf /tmp/${ETS_VER}.tar.gz -C /tmp && \
     cd /tmp/${ETS_VER}/files && ./install-bindist.sh ${HTTPD_DIR} && \
     rm -rf /tmp/*

RUN  ln -s ${HTTPD_DIR} ${ETS_DIR}

# setup node cli app

RUN mkdir -p ${NODE_DIR}
WORKDIR ${NODE_DIR}

COPY package.json ${NODE_DIR}
RUN  npm install
COPY . ${NODE_DIR}
RUN  npm link

# override default apache config to permit external
# mounting of config

COPY files/conf/ ${HTTPD_DIR}/conf/
COPY public/ /home/
RUN  mkdir -p /home/www && rm -rf ${NODE_DIR}/files

EXPOSE 80
EXPOSE 81
EXPOSE 82

ENTRYPOINT ["akamai-ets"]
