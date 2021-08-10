############
# FRONTEND #
############
FROM node AS build-ui

WORKDIR /ui

COPY ./frontend/package.json .
COPY ./frontend/yarn.lock .

RUN yarn

COPY ./frontend .

