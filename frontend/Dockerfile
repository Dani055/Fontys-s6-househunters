# Node 20.x LTS
FROM node:iron-alpine as base

ARG PORT 

# Set env vars here because if they are not present during build time, vite ignores them when running in production
ENV VITE_PORT=$PORT 

WORKDIR /

FROM base as dependencies

# Copy only the package we're building
COPY frontend frontend

WORKDIR /frontend
RUN npm install
RUN npm run build

# Get build and host it on nginx
FROM nginx:stable-alpine

# Renew PORT arg from previous stage
ARG PORT
RUN apk update && apk add --no-cache curl && apk add --no-cache bash

# Copy build folder from Vite
COPY --from=dependencies /frontend/dist /usr/share/nginx/html
# Copy nginx config
COPY --from=dependencies /frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE $PORT
ENTRYPOINT ["nginx","-g","daemon off;"]