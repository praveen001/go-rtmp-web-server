FROM node AS ui-builder

WORKDIR /frontend

COPY ./frontend/package.json .
COPY ./frontend/yarn.lock .

RUN yarn

COPY ./frontend .

RUN yarn build

FROM nginx:stable

COPY ./docker/multi-streamer-ui/nginx.conf /etc/nginx/nginx.conf

COPY --from=ui-builder /frontend/dist /usr/share/nginx/html

EXPOSE 80