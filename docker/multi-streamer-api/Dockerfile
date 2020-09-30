FROM golang:1.14 AS api-builder

WORKDIR /go/src/github.com/praveen001/go-rtmp-web-server

COPY ./go.sum .
COPY ./go.mod .

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 go build 

FROM alpine

WORKDIR /app

COPY --from=api-builder /go/src/github.com/praveen001/go-rtmp-web-server/go-rtmp-web-server ./go-rtmp-web-server

CMD ["./go-rtmp-web-server", "web"]