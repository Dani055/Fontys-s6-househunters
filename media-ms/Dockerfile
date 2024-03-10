# Node 20.x LTS
FROM node:iron-alpine as base

ARG PORT=9999

WORKDIR /

# Copy dependencies that we need
COPY media-ms media-ms

RUN npm install -g npm@10.2.5

WORKDIR /media-ms

RUN npm install --production

EXPOSE $PORT
ENTRYPOINT [ "node", "index.js" ]
