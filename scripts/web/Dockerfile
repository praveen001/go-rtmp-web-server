############
# FRONTEND #
############
FROM node AS build-ui

WORKDIR /ui

COPY ./frontend .
RUN yarn
RUN yarn build

RUN ls


###########
# BACKEND #
###########
FROM golang AS build-backend

COPY . /go/src/github.com/praveen001/go-rtmp-web-server
RUN cd /go/src/github.com/praveen001/go-rtmp-web-server && go get && go install


#########
# NGINX #
#########
FROM nginx:stable

WORKDIR /app
COPY ./scripts .
COPY ./scripts/web/nginx.conf /etc/nginx/nginx.conf
RUN chmod +x -R .

# Copy UI build files
COPY --from=build-ui /ui/dist /usr/share/nginx/html

# Copy WebServer binary to bin
COPY --from=build-backend /go/bin/go-rtmp-web-server /usr/local/bin/

RUN ls







# COPY --from=build-ffmpeg /usr/local /usr/local
# COPY --from=build-ffmpeg /usr/lib/libfdk-aac.so.1 /usr/lib/libfdk-aac.so.1