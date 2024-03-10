# Node 20.x LTS
FROM node:iron-alpine as base

ARG PORT=9996

WORKDIR /

FROM base as tsbuild

# Copy dependencies that we need
COPY bid-ms bid-ms

COPY shared shared

RUN npm install -g npm@10.2.5

WORKDIR /shared
RUN npm install

WORKDIR /bid-ms
RUN npm install
RUN npm run build

FROM node:iron-alpine as prod

# Renew PORT arg from previous stage
ARG PORT

ENV PORT=$PORT

# Copy dist folder from typescript compilation
COPY --from=tsbuild /bid-ms/dist /dist
COPY --from=tsbuild /bid-ms/package*.json /

RUN npm install --production

EXPOSE $PORT
ENTRYPOINT [ "npm", "run", "start:prod" ]
