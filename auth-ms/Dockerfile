# Node 20.x LTS
FROM node:iron-alpine as base

ARG PORT=9998 

WORKDIR /

FROM base as tsbuild

# Copy dependencies that we need
COPY auth-ms auth-ms

COPY shared shared

RUN npm install -g npm@10.2.5

WORKDIR /auth-ms
RUN npm run build

FROM node:iron-alpine as prod

# Renew PORT arg from previous stage
ARG PORT

ENV PORT=$PORT

# Copy dist folder from typescript compilation
COPY --from=tsbuild /auth-ms/dist /dist
COPY --from=tsbuild /auth-ms/package*.json /

RUN npm install --production

EXPOSE $PORT
ENTRYPOINT [ "npm", "run", "start:prod" ]
