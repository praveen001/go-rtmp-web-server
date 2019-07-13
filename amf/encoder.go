package amf

import (
	"github.com/Ranganaths/joy4/format/flv/flvio"
)

// Encode the payload into AMF binary form
func Encode(args ...interface{}) ([]byte, int) {
	var len int
	for _, val := range args {
		len += flvio.LenAMF0Val(val)
	}
	res := make([]byte, len)
	var offset int
	for _, val := range args {
		offset += flvio.FillAMF0Val(res[offset:], val)
	}

	return res, len
}
