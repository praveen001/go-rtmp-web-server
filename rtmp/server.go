package rtmp

import (
	"bufio"
	"fmt"
	"net"

	"github.com/Ranganaths/go-rtmp-grpc/pkg/api/v1"
	"github.com/gomodule/redigo/redis"
)

// StreamerContext ..
type StreamerContext struct {
	RPC      v1.UserChannelServiceClient
	Redis    redis.Conn
	sessions map[string]*Connection
	preview  chan string
}

func (ctx *StreamerContext) set(key string, c *Connection) {
	ctx.sessions[key] = c
}

func (ctx *StreamerContext) get(key string) *Connection {
	return ctx.sessions[key]
}

func (ctx *StreamerContext) delete(key string) {
	delete(ctx.sessions, key)
}

// InitServer starts the RTMP server
func InitServer(ctx *StreamerContext) {
	ctx.sessions = make(map[string]*Connection)
	ctx.preview = make(chan string)

	go InitPreviewServer(ctx)

	listener, err := net.Listen("tcp", ":1935")
	if err != nil {
		fmt.Printf("Error starting RTMP server %s", err.Error())
	}
	fmt.Println("RTMP Server started at port 1935")

	for {
		conn, err := listener.Accept()
		if err != nil {
			fmt.Printf("Unable to accept connection %s", err.Error())
		}

		rtmpConnection := &Connection{
			Conn:              conn,
			Reader:            bufio.NewReader(conn),
			Writer:            bufio.NewWriter(conn),
			ReadBuffer:        make([]byte, 5096),
			WriteBuffer:       make([]byte, 5096),
			csMap:             make(map[uint32]*rtmpChunk),
			ReadMaxChunkSize:  128,
			WriteMaxChunkSize: 4096,
			Stage:             handshakeStage,
			Context:           ctx,
		}

		go rtmpConnection.Serve()
	}
}
