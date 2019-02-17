# RTMP Server Build
# FROM golang AS build-backend

# COPY . /go/src/github.com/praveen001/go-rtmp-web-server

# RUN cd /go/src/github.com/praveen001/go-rtmp-web-server; go get; go install

###########
# BACKEND #
###########
FROM golang AS build-backend

COPY . /go/src/github.com/praveen001/go-rtmp-web-server
RUN cd /go/src/github.com/praveen001/go-rtmp-web-server && go get && go install

#########
# Nginx #
#########
FROM nginx

WORKDIR /app
COPY ./scripts .
COPY ./scripts/rtmp/nginx.conf /etc/nginx/nginx.conf
RUN chmod +x -R .

# Copy WebServer binary to bin
COPY --from=build-backend /go/bin/go-rtmp-web-server /usr/local/bin/