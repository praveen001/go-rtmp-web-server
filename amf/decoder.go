package amf

import (
	"encoding/binary"
	"math"
)

var rtmpCommandParams = map[string][]string{
	"connect":       []string{"transId", "cmdObj", "args"},
	"_result":       []string{"transId", "cmdObj", "info"},
	"releaseStream": []string{"transId", "cmdObj", "streamName"},
	"createStream":  []string{"transId", "cmdObj"},
	"publish":       []string{"transId", "cmdObj", "streamName", "type"},
	"FCPublish":     []string{"transId", "cmdObj", "streamName"},
	"FCUnpublish":   []string{"transId", "cmdObj", "streamName"},
	"onFCPublish":   []string{"transId", "cmdObj", "info"},
	"@setDataFrame": []string{"method", "dataObj"},
	"play":          []string{"transId", "cmdObj", "streamName", "start", "duration", "reset"},
}

// DecodedData ..
type DecodedData struct {
	remainingData []byte
	value         interface{}
}

func getDecoder(data []byte) func() DecodedData {
	typeMarker := uint8(data[0])
	var decoder func([]byte) DecodedData
	switch typeMarker {
	case 0x00:
		decoder = decodeNumber

	case 0x01:
		decoder = decodeBool

	case 0x02:
		decoder = decodeString

	case 0x03:
		decoder = decodeObject

	case 0x05:
		decoder = decodeNull

	case 0x08:
		decoder = decodeECMAArray
	}

	return func() DecodedData {
		return decoder(data[1:])
	}
}

// Decode AMF0 command object
func Decode(data []byte) map[string]interface{} {
	decoded := getDecoder(data)()
	cmd := map[string]interface{}{
		"cmd": decoded.value,
	}
	params := rtmpCommandParams[decoded.value.(string)]

	for _, param := range params {
		if len(decoded.remainingData) > 0 {
			decoded = getDecoder(decoded.remainingData)()
			cmd[param] = decoded.value
		}
	}

	return cmd
}

func decodeNumber(data []byte) DecodedData {
	return DecodedData{
		remainingData: data[8:],
		value:         math.Float64frombits(binary.BigEndian.Uint64(data[:8])),
	}
}

func decodeBool(data []byte) DecodedData {
	return DecodedData{
		remainingData: data[1:],
		value:         data[0] != 0,
	}
}

func decodeString(data []byte) DecodedData {
	len := binary.BigEndian.Uint16(data[:2])
	return DecodedData{
		remainingData: data[2+len:],
		value:         string(data[2 : 2+len]),
	}
}

func decodeObject(data []byte) DecodedData {
	object := make(map[string]interface{})
	tData := data
	for len(tData) != 0 {
		decoded := decodeString(tData)
		key := decoded.value.(string)
		tData = decoded.remainingData

		if uint8(tData[0]) == 0x09 {
			tData = tData[1:]
			break
		}

		decoded = getDecoder(tData)()
		tData = decoded.remainingData
		object[key] = decoded.value
	}

	return DecodedData{
		remainingData: tData,
		value:         object,
	}
}

func decodeNull(data []byte) DecodedData {
	return DecodedData{
		remainingData: data,
		value:         nil,
	}
}

func decodeECMAArray(data []byte) DecodedData {
	decoded := decodeObject(data[4:])
	return DecodedData{
		remainingData: decoded.remainingData,
		value:         decoded.value,
	}
}
