package rtmp

import (
	"encoding/binary"
	"fmt"
	"io"
)

/*
   handshake will first read C0(1 byte) and C1(1536 bytes) together

   It will then generate S0(1 byte, same as C0), S1(1536 bytes) and S2(1536 bytes)
   and send it to the RTMP client.

   It will wait till it gets C2, which should be same as S1
*/
func (c *Connection) handshake() (err error) {
	var random [(1 + 1536 + 1536) * 2]byte

	var C0C1C2 = random[:(1 + 1536 + 1536)]
	var C0 = C0C1C2[:1]
	var C1 = C0C1C2[1 : 1536+1]
	var C0C1 = C0C1C2[:1536+1]
	var C2 = C0C1C2[1+1536:]

	var S0S1S2 = random[(1 + 1536 + 1536):]
	var S0 = S0S1S2[:1]
	var S1 = S0S1S2[1 : 1536+1]
	var S2 = S0S1S2[1+1536:]

	_, err = io.ReadFull(c.Reader, C0C1)
	if err != nil {
		fmt.Printf("Error while reading C0C1 %s", err.Error())
		return
	}

	if C0[0] != 3 {
		fmt.Printf("Unsupported RTMP version %d", C0[0])
		return
	}
	fmt.Printf("Client requesting version %d\n", C0[0])

	clientTime := binary.BigEndian.Uint32(C1[:4])
	// serverTime := clientTime
	clientVersion := binary.BigEndian.Uint32(C1[4:8])
	// serverVersion := uint32(0x0d0e0a0d)

	fmt.Println("Time", clientTime)
	fmt.Println("Flash Version", binary.BigEndian.Uint32(C1[4:8]))

	// S0[0] = 3
	if clientVersion != 0 {
		// Complex handshake
	} else {
		copy(S0, C0)
		copy(S1, C1)
		copy(S2, C2)
	}

	_, err = c.Writer.Write(S0S1S2)
	if err != nil {
		fmt.Printf("Error writing S0S1S2 %s\n", err.Error())
		return
	}
	if err = c.Writer.Flush(); err != nil {
		fmt.Println("Error flushing S0S1S2")
	}

	if _, err = io.ReadFull(c.Reader, C2); err != nil {
		fmt.Printf("Error reading C2 %s", err.Error())
		return
	}

	c.Stage++
	return
}
