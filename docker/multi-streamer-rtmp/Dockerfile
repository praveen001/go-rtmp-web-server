FROM golang:1.14 AS api-builder

WORKDIR /go/src/github.com/praveen001/go-rtmp-web-server

COPY ./go.mod .
COPY ./go.sum .

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 go build 

FROM ubuntu:18.04

WORKDIR /app

RUN apt-get update

RUN apt-get --yes install ffmpeg

COPY --from=api-builder /go/src/github.com/praveen001/go-rtmp-web-server/go-rtmp-web-server ./go-rtmp-web-server

CMD ["./go-rtmp-web-server", "rtmp"]