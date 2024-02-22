# Get build and host it on nginx
FROM nginx:stable-alpine

# Renew PORT arg from previous stage

EXPOSE 3000
ENTRYPOINT ["nginx","-g","daemon off;"]