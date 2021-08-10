###########
# BACKEND #
###########
FROM golang:1.14 AS api-builder

WORKDIR /go/src/github.com/praveen001/go-rtmp-web-server

COPY ./go.sum .
COPY ./go.mod .

RUN chmod +x -R .

RUN go mod download
RUN curl -sSfL https://raw.githubusercontent.com/cosmtrek/air/master/install.sh | sh -s -- -b $(go env GOPATH)/bin

COPY . .

RUN chmod +x -R .
