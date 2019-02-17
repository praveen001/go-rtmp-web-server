package rtmp

import (
	"bufio"
	"fmt"
	"net"
)

const (
	_ = iota
	handshakeStage
	commandStage
	commandStageDone
)

const (
	genuineFMS = "Genuine Adobe Flash Media Server 001"
	genuineFp  = "Genuine Adobe Flash Player 001"
)

// Parse States
const (
	RtmpParseInit = iota
	RtmpParseBasicHeader
	RtmpParseMessageHeader
	RtmpParseExtendedHeader
	RtmpParsePayload
)

type Channel struct {
	ChannelID int64
	Send      chan []byte
	Exit      chan bool
}

// Connection a RTMP connection
type Connection struct {
	Conn              net.Conn
	Reader            *bufio.Reader
	Writer            *bufio.Writer
	ReadBuffer        []byte
	WriteBuffer       []byte
	Stage             int
	HandshakeDone     bool
	ConnectionDone    bool
	GotMessage        bool
	csMap             map[uint32]*rtmpChunk
	ReadMaxChunkSize  int
	WriteMaxChunkSize int
	AppName           string
	StreamKey         string
	Streams           int

	AudioSampleRate float64
	AudioChannels   float64
	VideoWidth      float64
	VideoHeight     float64
	FPS             float64

	Clients        []Channel
	WaitingClients []Channel
	StreamID       int64
	UserID         int64
	Context        *StreamerContext
	GotFirstAudio  bool
	GotFirstVideo  bool
	MetaData       []byte
	FirstAudio     []byte
	FirstVideo     []byte
	GOP            [][]byte

	Proxy []*bufio.Writer
}

// Serve the RTMP connection
func (c *Connection) Serve() {

	if err := c.handshake(); err != nil {
		fmt.Println("Handshake failed")
		return
	}
	fmt.Println("Handhshake completed")

	if err := c.prepare(); err != nil {
		fmt.Println("Error while preparing RTMP connection")
		return
	}
	fmt.Println("Connection completed")

	for c.Stage < commandStageDone {
		c.readMessage()
	}
	fmt.Println("Command stage completed")

	for {
		if err := c.readChunk(); err != nil {
			c.closeConnection()
			return
		}
	}

	// var zz bool
	// var cc int
	// p := make([]byte, 5000)
	// for {
	// 	n, err := c.Reader.Read(p)
	// 	if err != nil {
	// 		if err == io.EOF {
	// 			c.closeConnection()
	// 			break
	// 		}
	// 	}

	// 	m := make([]byte, n)
	// 	copy(m, p)
	// 	for _, client := range c.Clients {
	// 		client.Send <- m
	// 	}
	// 	c.GOP = append(c.GOP, m)
	// 	if !zz && cc > 200 {
	// 		zz = true
	// 		c.Context.preview <- "rtmp://localhost/" + c.AppName + "/" + c.StreamKey
	// 	} else {
	// 		cc++
	// 	}
	// }
}

/*
ffmpeg -v verbose -i rtmp://localhost:1935/live2/123 -c:v libx264 -c:a aac -ac 1 -strict -2 -crf 18 -profile:v baseline -maxrate 400k -bufsize 1835k -pix_fmt yuv420p -flags -global_header -hls_time 10 -hls_list_size 6 -hls_wrap 10 -start_number 1 /home/praveen/hls/123.m3u8
*/
