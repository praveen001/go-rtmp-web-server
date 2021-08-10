# RTMP Server Build
# FROM golang AS build-backend

# COPY . /go/src/github.com/praveen001/go-rtmp-web-server

# RUN cd /go/src/github.com/praveen001/go-rtmp-web-server; go get; go install

###########
# BACKEND #
###########
FROM golang AS build-backend

COPY . /go/src/github.com/praveen001/go-rtmp-web-server
RUN cd /go/src/github.com/praveen001/go-rtmp-web-server && go get && CGO_ENABLED=0 go build 

#########
# Nginx #
#########
FROM node:alpine
RUN apk update && apk add bash
RUN apk add --no-cache ffmpeg

WORKDIR /app

# Copy WebServer binary to bin
COPY --from=build-backend /go/src/github.com/praveen001/go-rtmp-web-server/go-rtmp-web-server /usr/local/bin

RUN chmod +x -R .