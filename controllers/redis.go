package controllers

import (
	"encoding/json"
	"fmt"

	"github.com/gomodule/redigo/redis"
)

// PubSub ..
type PubSub struct {
	*redis.PubSubConn
}

// NewPubSub ..
func NewPubSub(redisConn redis.Conn, channel string) *PubSub {
	pubsub := &PubSub{
		&redis.PubSubConn{
			Conn: redisConn,
		},
	}

	if pubsub.PubSubConn.Subscribe(channel) != nil {
		panic("Unable to subscribe to redis")
	}

	return pubsub
}

// Listen will read messages published to the subscribed channel
func (ps *PubSub) Listen(hub *WSHub) {
	var t map[string]interface{}

	for {
		raw := ps.PubSubConn.Receive()
		switch raw.(type) {
		case redis.Subscription:
		case redis.Message:
			if err := json.Unmarshal(raw.(redis.Message).Data, &t); err != nil {
				fmt.Println("Unable to unmarshal redis message")
				continue
			}

			payload, err := json.Marshal(t["Message"])
			if err != nil {
				fmt.Println("Unable to marshal redis message payload")
				continue
			}

			outgoing := WSOutgoing{
				ID:      int(t["ID"].(float64)),
				Message: payload,
			}
			hub.Outgoing <- outgoing
		}
	}
}
