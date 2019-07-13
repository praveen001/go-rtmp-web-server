package rtmp

import (
	"bufio"
	"context"
	"encoding/binary"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"

	"github.com/Ranganaths/go-rtmp-grpc/pkg/api/v1"
	"github.com/Ranganaths/go-rtmp-web-server/amf"
	"github.com/praveen001/joy4/format/flv/flvio"
	"github.com/praveen001/joy4/format/rtmp"
	"github.com/praveen001/joy4/utils/bits/pio"
)

func (c *Connection) prepare() (err error) {
	for {
		c.readMessage()
		if c.ConnectionDone {
			return
		}
	}
}

func (c *Connection) readMessage() (err error) {
	c.GotMessage = false
	for {
		if err = c.readChunk(); err != nil {
			fmt.Println("Error while reading message")
			return
		}
		if c.GotMessage {
			return
		}
	}
}

func (c *Connection) readChunk() (err error) {
	var bytesRead int

	// Read the basic header (1 byte by default)
	if _, err = io.ReadFull(c.Reader, c.ReadBuffer[:1]); err != nil {
		return
	}
	bytesRead++

	csid := uint32(c.ReadBuffer[0]) & 0x3f
	_fmt := uint8(c.ReadBuffer[0] >> 6)

	/*
		if csid is 0, then it means the actual csid is to be read from next 1 byte
		if csid is 1, then it means the actual csid is to be read from next 2 bytes
		otherwise csid is the actual csid
	*/
	if csid == 0 {
		if _, err = io.ReadFull(c.Reader, c.ReadBuffer[bytesRead:bytesRead+1]); err != nil {
			return
		}
		csid = uint32(c.ReadBuffer[bytesRead]) + 64
		bytesRead++
	} else if csid == 1 {
		if _, err = io.ReadFull(c.Reader, c.ReadBuffer[bytesRead:bytesRead+2]); err != nil {
			return
		}
		// csid = 64 + uint32(binary.BigEndian.Uint16(c.ReadBuffer[:2]))*256
		csid = ((uint32(c.ReadBuffer[bytesRead+1]) * 256) + uint32(c.ReadBuffer[bytesRead]+64))
		bytesRead += 2
	} else {
	}

	// Pick the previous chunk of same chunk stream ID
	chunk, ok := c.csMap[csid]
	if !ok {
		fmt.Println("New Chunk", csid)
		chunk = c.createRtmpChunk(_fmt, csid)
	}

	/*
		if fmt is 2, then message header is 3 bytes long, has only timestamp delta
		if fmt is 1, then message header is 7 bytes long, has timestamp delta, message length, message type id
		if fmt is 0, then message header is 11 bytes long, has absolute timestamp, message length, message type id, message stream id
	*/

	/*
		timestamp - 		 		3 bytes
		message length - 		3 byte
		message type id- 		1 byte
		message stream id-	4 bytes, little endian

	*/

	if _fmt <= 2 {
		if _, err = io.ReadFull(c.Reader, c.ReadBuffer[bytesRead:bytesRead+3]); err != nil {
			return
		}
		chunk.header.timestamp = pio.U24BE(c.ReadBuffer[bytesRead : bytesRead+3])
		bytesRead += 3
	}

	if _fmt <= 1 {
		if _, err = io.ReadFull(c.Reader, c.ReadBuffer[bytesRead:bytesRead+4]); err != nil {
			return
		}
		chunk.header.length = pio.U24BE(c.ReadBuffer[bytesRead : bytesRead+3])
		chunk.header.messageType = uint8(c.ReadBuffer[bytesRead+3])
		bytesRead += 4
	}

	if _fmt == 0 {
		if _, err = io.ReadFull(c.Reader, c.ReadBuffer[bytesRead:bytesRead+4]); err != nil {
			return
		}
		chunk.header.messageStreamID = binary.LittleEndian.Uint32(c.ReadBuffer[bytesRead : bytesRead+4])
		bytesRead += 4
	}

	if chunk.header.timestamp == 0xFFFFFF {
		chunk.header.hasExtendedTimestamp = true
		if _, err = io.ReadFull(c.Reader, c.ReadBuffer[bytesRead:bytesRead+4]); err != nil {
			return
		}
		extendedTimestamp := binary.BigEndian.Uint32(c.ReadBuffer[bytesRead : bytesRead+4])
		chunk.header.timestamp = extendedTimestamp
		bytesRead += 4
	} else {
		chunk.header.hasExtendedTimestamp = false
	}
	chunk.delta = chunk.header.timestamp
	chunk.clock += chunk.header.timestamp

	if chunk.bytes == 0 {
		chunk.payload = make([]byte, chunk.header.length)
		chunk.capacity = chunk.header.length
	}

	size := int(chunk.header.length) - chunk.bytes
	if size > c.ReadMaxChunkSize {
		size = c.ReadMaxChunkSize
	}

	n, err := io.ReadFull(c.Reader, c.ReadBuffer[bytesRead:bytesRead+size])
	if err != nil {
		return
	}
	chunk.payload = append(chunk.payload[:chunk.bytes], c.ReadBuffer[bytesRead:bytesRead+size]...)
	chunk.bytes += n
	bytesRead += n

	if c.Stage == commandStageDone {
		temp := make([]byte, bytesRead)
		copy(temp, c.ReadBuffer[:bytesRead])
		if c.GotFirstAudio && c.GotFirstVideo {
			// c.GOP = append(c.GOP, temp)
		}
		for _, client := range c.Clients {
			client.Send <- temp
		}
	}

	if chunk.bytes == int(chunk.header.length) {
		c.GotMessage = true
		chunk.bytes = 0
		c.handleChunk(chunk)
	}
	c.csMap[chunk.header.csid] = chunk
	bytesRead = 0

	return
}

func (c *Connection) handleChunk(chunk *rtmpChunk) {
	fmt.Println("Handle Chunk", chunk.header.messageType)
	switch chunk.header.messageType {

	// Set Max Read Chunk Size
	case 1:
		c.ReadMaxChunkSize = int(binary.BigEndian.Uint32(chunk.payload))

	case 5:
		// Window ACK Size

	// AMF0 Command
	case 20:
		c.handleAmf0Commands(chunk)

	case 18:
		c.handleDataMessages(chunk)

	case 8:
		c.handleAudioData(chunk)

	case 9:
		c.handleVideoData(chunk)

	default:
		fmt.Println("UNKNOWN CHUNK RECEIVED", chunk.header.messageType)
		fmt.Println(chunk.header.fmt, chunk.header.csid, chunk.header.hasExtendedTimestamp, chunk.header.length, chunk.header.messageStreamID, chunk.header.messageType, chunk.header.timestamp)
		// panic(chunk.header.messageStreamID)
	}
}

func (c *Connection) handleAmf0Commands(chunk *rtmpChunk) {
	command := amf.Decode(chunk.payload)

	switch command["cmd"] {
	case "connect":
		c.onConnect(command)
	case "releaseStream":
		c.onRelease(command)
	case "FCPublish":
		c.onFCPublish(command)
	case "createStream":
		c.onCreateStream(command)
	case "publish":
		c.onPublish(command, chunk.header.messageStreamID)
	case "play":
		c.onPlay(command, chunk)
	case "pause":
		fmt.Println("Pause")
	case "FCUnpublish":
	case "deleteStream":
		fmt.Println("Delete Stream")
	case "closeStream":
		fmt.Println("Close Stream")
	case "receiveAudio":
		fmt.Println("Receive Audio")
	case "receiveVideo":
		fmt.Println("Receive Video")
	default:
		fmt.Println("UNKNOWN AMF COMMAND RECEIVED")
	}
}

func (c *Connection) onConnect(connectCommand map[string]interface{}) {
	fmt.Println("On Connect", connectCommand)
	c.AppName = connectCommand["cmdObj"].(map[string]interface{})["app"].(string)
	c.setMaxWriteChunkSize(128)
	c.sendWindowACK(5000000)
	c.setPeerBandwidth(5000000, 2)
	c.Writer.Flush()

	cmd := "_result"
	transID := connectCommand["transId"]
	cmdObj := flvio.AMFMap{
		"fmsVer":       "FMS/3,0,1,123",
		"capabilities": 31,
	}
	info := flvio.AMFMap{
		"level":          "status",
		"code":           "NetConnection.Connect.Success",
		"description":    "Connection succeeded",
		"objectEncoding": 0,
	}
	amfPayload, length := amf.Encode(cmd, transID, cmdObj, info)

	chunk := &rtmpChunk{
		header: &chunkHeader{
			fmt:             0,
			csid:            3,
			messageType:     20,
			messageStreamID: 0,
			timestamp:       0,
			length:          uint32(length),
		},
		clock:    0,
		delta:    0,
		capacity: 0,
		bytes:    0,
		payload:  amfPayload,
	}
	for _, ch := range c.create(chunk) {
		c.Writer.Write(ch)
	}
	c.Writer.Flush()

	c.ConnectionDone = true
}

func (c *Connection) setMaxWriteChunkSize(size uint16) {
	buf, _ := hex.DecodeString("02000000000004010000000000001000")
	if _, err := c.Writer.Write(buf); err != nil {
		fmt.Println("Failed to set max chunk size")
	}

}

func (c *Connection) sendWindowACK(size uint32) {
	buf, _ := hex.DecodeString("02000000000004030000000010001000")
	if _, err := c.Writer.Write(buf); err != nil {
		fmt.Println("Failed to sent window ack size")
	}
}

func (c *Connection) setPeerBandwidth(size uint32, limit uint8) {
	buf, _ := hex.DecodeString("0200000000000506000000000100100002")
	if _, err := c.Writer.Write(buf); err != nil {
		fmt.Println("Failed to set peer bandwidth")
	}
}

func (c *Connection) onRelease(command map[string]interface{}) {
	fmt.Println("On Release", command)
}

func (c *Connection) onFCPublish(command map[string]interface{}) {
	fmt.Println("On FC Publish", command)
}

func (c *Connection) onCreateStream(command map[string]interface{}) {
	fmt.Println("On Create Stream", command)
	c.Streams++

	cmd := "_result"
	transID := command["transId"]
	cmdObj := interface{}(nil)
	info := c.Streams

	amfPayload, length := amf.Encode(cmd, transID, cmdObj, info)

	chunk := &rtmpChunk{
		header: &chunkHeader{
			fmt:             0,
			csid:            3,
			messageType:     20,
			messageStreamID: 0,
			timestamp:       0,
			length:          uint32(length),
		},
		clock:    0,
		delta:    0,
		capacity: 0,
		bytes:    0,
		payload:  amfPayload,
	}

	for _, ch := range c.create(chunk) {
		c.Writer.Write(ch)
	}
	c.Writer.Flush()
}

func (c *Connection) onPublish(command map[string]interface{}, messageStreamID uint32) {
	fmt.Println("On Publish", command)
	cmd := "onStatus"
	transID := 0
	cmdObj := interface{}(nil)
	info := flvio.AMFMap{
		"level":       "status",
		"code":        "NetStream.Publish.Start",
		"description": "Published",
	}

	amfPayload, length := amf.Encode(cmd, transID, cmdObj, info)

	chunk := &rtmpChunk{
		header: &chunkHeader{
			fmt:             0,
			csid:            3,
			messageType:     20,
			messageStreamID: messageStreamID,
			timestamp:       0,
			length:          uint32(length),
		},
		clock:    0,
		delta:    0,
		capacity: 0,
		bytes:    0,
		payload:  amfPayload,
	}

	c.Context.set(command["streamName"].(string), c)
	c.StreamKey = command["streamName"].(string)

	res, err := c.Context.RPC.Get(context.Background(), &v1.GetUserChannelRequest{
		StreamKey: command["streamName"].(string),
	})
	if err != nil {
		fmt.Println("RPC Error", err.Error())
	}
	c.StreamID = res.StreamID
	c.UserID = res.User.ID

	for i, channel := range res.Channels {
		ch := Channel{
			ChannelID: channel.ID,
			Send:      make(chan []byte, 100),
			Exit:      make(chan bool, 5),
		}
		c.Clients = append(c.Clients, ch)
		c.prepareClient(channel.URL+"/"+channel.Key, c.Clients[i])
	}
	redisMsg := map[string]interface{}{
		"ID": c.UserID,
		"Message": map[string]interface{}{
			"type":     "stats/streamOnline",
			"streamId": c.StreamID,
		},
	}
	redisMsgBytes, _ := json.Marshal(redisMsg)
	c.Context.Redis.Do("PUBLISH", "Stream", redisMsgBytes)
	c.Context.preview <- c.StreamKey
	// c.prepareClient("rtmp://live-api-s.facebook.com:80/rtmp/2149054425146767?ds=1&s_sw=0&s_vt=api-s&a=AbwniKg-7CkiybO1", c.Clients[0])

	for _, ch := range c.create(chunk) {
		c.Writer.Write(ch)
	}
	c.Writer.Flush()

	c.Stage++
}

func (c *Connection) prepareClient(url string, ch Channel) {
	client, err := rtmp.Dial(url)
	if err != nil {
		fmt.Println("Failed to connect")
		return
	}
	client.Prepare()

	clientWriter := bufio.NewWriter(client.NetConn())
	c.Proxy = append(c.Proxy, clientWriter)

	go func() {
		for {
			select {
			case chunk := <-ch.Send:
				fmt.Println("Sending...")
				clientWriter.Write(chunk)
			case <-ch.Exit:
				client.WriteTrailer()
				client.Close()
				return
			}
			clientWriter.Flush()
		}
	}()
}

func (c *Connection) closeConnection() {
	c.killClients()

	redisMsg := map[string]interface{}{
		"ID": c.UserID,
		"Message": map[string]interface{}{
			"type":     "stats/streamOffline",
			"streamId": c.StreamID,
		},
	}
	redisMsgBytes, _ := json.Marshal(redisMsg)

	c.Context.Redis.Do("PUBLISH", "Stream", redisMsgBytes)
}

func (c *Connection) killClients() {
	for _, client := range c.Clients {
		client.Exit <- true
	}
}

func (c *Connection) handleDataMessages(chunk *rtmpChunk) {
	command := amf.Decode(chunk.payload)
	// dataObj := command["dataObj"].(map[string]interface{})

	switch command["cmd"] {
	case "@setDataFrame":
		// c.AudioSampleRate = dataObj["audiosamplerate"].(float64)
		// c.AudioChannels = dataObj["audiochannels"].(float64)
		// c.VideoHeight = dataObj["height"].(float64)
		// c.VideoWidth = dataObj["width"].(float64)
		// c.FPS = dataObj["framerate"].(float64)

		fmt.Println("Set Data Frame")
		c.MetaData = append(c.MetaData, chunk.payload...)
	}
}

func (c *Connection) handleAudioData(chunk *rtmpChunk) {
	chunk.header.timestamp = chunk.clock
	if !c.GotFirstAudio {
		c.FirstAudio = append(c.FirstAudio, chunk.payload...)
	}
	c.GotFirstAudio = true
}

func (c *Connection) handleVideoData(chunk *rtmpChunk) {
	chunk.header.timestamp = chunk.clock
	if !c.GotFirstVideo {
		c.FirstVideo = append(c.FirstVideo, chunk.payload...)
	}
	c.GotFirstVideo = true
	if len(c.WaitingClients) > 0 {
		frameType := chunk.payload[0] >> 4
		// codecId := frameType & 0x0f
		// frameType = (frameType >> 4) & 0x0f
		if frameType == 1 {
			for i, client := range c.WaitingClients {
				for _, ch := range c.create(chunk) {
					client.Send <- ch
				}
				c.Clients = append(c.Clients, client)
				c.WaitingClients = append(c.WaitingClients[:i], c.WaitingClients[i+1:]...)
			}
		}
	}
}

func (c *Connection) proxyData(chunks [][]byte) {
	for _, client := range c.Clients {
		for _, chunk := range chunks {
			client.Send <- chunk
		}
	}
}

func (c *Connection) onPlay(command map[string]interface{}, playChunk *rtmpChunk) {
	fmt.Println(command["streamName"])
	co := c.Context.get(command["streamName"].(string))
	if co == nil {
		fmt.Println("Stream not found")
		return
	}

	b := make([]byte, 6)
	binary.BigEndian.PutUint16(b[:2], 0)
	binary.BigEndian.PutUint32(b[2:], playChunk.header.messageStreamID)
	chunk := &rtmpChunk{
		header: &chunkHeader{
			fmt:             0,
			csid:            2,
			messageType:     4,
			messageStreamID: 0,
			timestamp:       0,
			length:          uint32(6),
		},
		clock:    0,
		delta:    0,
		capacity: 0,
		bytes:    0,
		payload:  b,
	}
	for _, ch := range c.create(chunk) {
		c.Writer.Write(ch)
	}

	info := flvio.AMFMap{
		"level":       "status",
		"code":        "NetStream.Play.Start",
		"description": "Start live",
	}
	amfPayload, _ := amf.Encode("onStatus", 4, nil, info)

	chunk = &rtmpChunk{
		header: &chunkHeader{
			fmt:             0,
			csid:            3,
			messageType:     20,
			messageStreamID: playChunk.header.messageStreamID,
			timestamp:       0,
			length:          uint32(len(amfPayload)),
		},
		clock:    0,
		delta:    0,
		capacity: 0,
		bytes:    0,
		payload:  amfPayload,
	}
	for _, ch := range c.create(chunk) {
		c.Writer.Write(ch)
	}

	amfPayload, _ = amf.Encode("|RtmpSampleAccess", false, false)
	chunk = &rtmpChunk{
		header: &chunkHeader{
			fmt:             0,
			csid:            6,
			messageType:     20,
			messageStreamID: 0,
			timestamp:       0,
			length:          uint32(len(amfPayload)),
		},
		clock:    0,
		delta:    0,
		capacity: 0,
		bytes:    0,
		payload:  amfPayload,
	}
	for _, ch := range c.create(chunk) {
		c.Writer.Write(ch)
	}

	c.Writer.Flush()
	c.Stage = commandStageDone

	chunk = &rtmpChunk{
		header: &chunkHeader{
			fmt:             0,
			csid:            6,
			messageType:     18,
			messageStreamID: playChunk.header.messageStreamID,
			timestamp:       0,
			length:          uint32(len(co.MetaData)),
		},
		clock:    0,
		delta:    0,
		capacity: 0,
		bytes:    0,
		payload:  co.MetaData,
	}
	for _, ch := range c.create(chunk) {
		c.Writer.Write(ch)
		fmt.Println(len(ch))
	}
	c.Writer.Flush()
	fmt.Println("Sent Meta Data")

	chunk = &rtmpChunk{
		header: &chunkHeader{
			fmt:             0,
			csid:            4,
			messageType:     8,
			messageStreamID: playChunk.header.messageStreamID,
			timestamp:       0,
			length:          uint32(len(co.FirstAudio)),
		},
		clock:    0,
		delta:    0,
		capacity: 0,
		bytes:    0,
		payload:  co.FirstAudio,
	}
	fmt.Println("Sent Audio Data")
	for _, ch := range c.create(chunk) {
		c.Writer.Write(ch)
	}
	c.Writer.Flush()

	chunk = &rtmpChunk{
		header: &chunkHeader{
			fmt:             0,
			csid:            4,
			messageType:     9,
			messageStreamID: playChunk.header.messageStreamID,
			timestamp:       0,
			length:          uint32(len(co.FirstVideo)),
		},
		clock:    0,
		delta:    0,
		capacity: 0,
		bytes:    0,
		payload:  co.FirstVideo,
	}
	fmt.Println("Sent Video Data")
	for _, ch := range c.create(chunk) {
		c.Writer.Write(ch)
	}

	c.Writer.Flush()

	// for _, d := range co.GOP {
	// 	c.Writer.Write(d)
	// }

	ch := Channel{
		ChannelID: -1,
		Send:      make(chan []byte, 100),
		Exit:      make(chan bool, 5),
	}
	co.WaitingClients = append(co.WaitingClients, ch)
	// co.Clients = append(co.Clients, ch)
	func(client *Connection) {
		clientWriter := bufio.NewWriter(c.Conn)
		for {
			// fmt.Println("Waiting data to play*********************************************************")
			select {
			case chunk := <-ch.Send:
				clientWriter.Write(chunk)
			case <-ch.Exit:
				client.Conn.Close()
				return
			}
			// fmt.Println("___________________________________")
			clientWriter.Flush()
		}
	}(c)
}
