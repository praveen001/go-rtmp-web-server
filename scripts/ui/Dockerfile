############
# FRONTEND #
############
FROM node AS build-ui

WORKDIR /ui

COPY ./frontend .
RUN yarn
RUN yarn build


#########
# NGINX #
#########
FROM nginx:stable

WORKDIR /app
COPY ./scripts/ui/nginx.conf /etc/nginx/nginx.conf

# Copy UI build files
COPY --from=build-ui /ui/dist /usr/share/nginx/html