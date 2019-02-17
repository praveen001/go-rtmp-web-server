package controllers

import (
	"bytes"
	"fmt"
	"log"
	"net/http"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gorilla/websocket"
)

func checkOrigin(r *http.Request) bool {
	return true
}

var upgrader = websocket.Upgrader{
	CheckOrigin: checkOrigin,
}

var (
	newline = []byte{'\n'}
	space   = []byte{' '}
)

// WSOutgoing ..
type WSOutgoing struct {
	ID      int
	Message []byte
}

// WSHub ..
type WSHub struct {
	Clients    map[int]map[int]*WSClient
	Register   chan *WSClient
	Unregister chan *WSClient
	Incoming   chan []byte
	Outgoing   chan WSOutgoing
	ID         int
}

// NewHub ..
func NewHub() *WSHub {
	return &WSHub{
		Clients:    make(map[int]map[int]*WSClient),
		Register:   make(chan *WSClient),
		Unregister: make(chan *WSClient),
		Incoming:   make(chan []byte, 10),
		Outgoing:   make(chan WSOutgoing, 10),
	}
}

// Run .
func (h *WSHub) Run() {
	for {
		select {
		case client := <-h.Register:
			h.ID++
			client.Index = h.ID
			if h.Clients[client.ID] == nil {
				h.Clients[client.ID] = make(map[int]*WSClient)
			}
			fmt.Println("Connected", client.ID)
			h.Clients[client.ID][h.ID] = client

		case client := <-h.Unregister:
			fmt.Println("Disconnected", client.ID)
			delete(h.Clients[client.ID], client.Index)
			close(client.Send)

		case message := <-h.Incoming:
			fmt.Println("Got a message", message)

		case outgoing := <-h.Outgoing:
			fmt.Println("Got a message - 1", outgoing)
			if h.Clients[outgoing.ID] != nil {
				for _, client := range h.Clients[outgoing.ID] {
					client.Send <- outgoing.Message
				}
			}
		}
	}
}

// WSClient ..
type WSClient struct {
	ID    int
	Index int
	Hub   *WSHub
	Conn  *websocket.Conn
	Send  chan []byte
}

// Reader ..
func (wc *WSClient) Reader() {
	defer func() {
		wc.Hub.Unregister <- wc
		wc.Conn.Close()
	}()

	wc.Conn.SetReadLimit(512)
	for {
		_, message, err := wc.Conn.ReadMessage()
		if err != nil {
			fmt.Println("Read Error", err.Error())
			break
		}

		message = bytes.TrimSpace(bytes.Replace(message, newline, space, -1))
		wc.Hub.Incoming <- message
	}
}

// Writer ..
func (wc *WSClient) Writer() {
	for {
		select {
		case message := <-wc.Send:
			wc.Conn.WriteMessage(websocket.TextMessage, message)
		}
	}
}

// HandleWebsocket ..
func (c *ApplicationContext) HandleWebsocket(w http.ResponseWriter, r *http.Request) {
	tokenString := r.FormValue("token")
	token, err := VerifyJWT(tokenString)
	if err != nil {
		log.Println("Unauthenticated ", err.Error())
		c.NewResponse(w).Status(403)
		return
	}
	claims := token.Claims.(jwt.MapClaims)
	id := int(claims["id"].(float64))

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Unable to upgrade websocket connection ", err.Error())
		return
	}

	client := &WSClient{
		ID:   id,
		Hub:  c.Hub,
		Conn: conn,
		Send: make(chan []byte, 512),
	}
	client.Hub.Register <- client

	go client.Reader()
	go client.Writer()
}

// VerifyJWT decodes a JWT and returns the token
func VerifyJWT(tokenString string) (*jwt.Token, error) {
	return jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte("Secret"), nil
	})
}
