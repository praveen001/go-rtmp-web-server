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
RUN chmod +x -R .

# Copy WebServer binary to bin
COPY --from=build-backend /go/bin/go-rtmp-web-server /usr/local/bin/