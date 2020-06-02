FROM node:alpine

MAINTAINER Will Li

WORKDIR /front-end
COPY package.json /front-end/
RUN apk add --no-cache --virtual .build-deps \
    ca-certificates \
    wget \
    tar && \
    cd /usr/local/bin && \
    wget https://yarnpkg.com/latest.tar.gz && \
    tar zvxf latest.tar.gz && \
    ln -s /usr/local/bin/dist/bin/yarn.js /usr/local/bin/yarn.js && \
    apk del .build-deps
RUN yarn
COPY . /front-end/

EXPOSE 3000
CMD ["yarn", "start"]
# RUN npm run build
