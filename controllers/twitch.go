package controllers

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strconv"

	"github.com/google/uuid"
	"github.com/praveen001/go-rtmp-web-server/models"
)

var clientID string
var clientSecret string
var redirectURL string

// InitTwitch will initialize twitch api configs
func InitTwitch() {
	clientID = os.Getenv("TWITCH_CLIENT_ID")
	clientSecret = os.Getenv("TWITCH_CLIENT_SECRET")
	redirectURL = os.Getenv("API_ENDPOINT") + os.Getenv("TWITCH_REDIRECT_URL")
}

// TwitchAuth ..
func (c *ApplicationContext) TwitchAuth(w http.ResponseWriter, r *http.Request) {
	redisConn := c.RedisPool.Get()
	defer redisConn.Close()

	id := uuid.New().String()
	userID := int(r.Context().Value("id").(float64))
	streamID, err := strconv.Atoi(r.FormValue("streamId"))
	if err != nil {
		c.NewResponse(w).Status(400).SendJSON(Response{
			Error:   true,
			Message: "Invalid Stream ID",
		})
		return
	}

	// Check whether stream belongs to user
	stream := &models.Stream{
		Model: models.Model{
			ID: streamID,
		},
	}
	c.DB.Find(stream, stream)

	if stream.UserID != userID {
		c.NewResponse(w).Status(403).SendJSON(Response{
			Error:   true,
			Message: "Unauthorized",
		})
		return
	}

	redisConn.Do("SET", id, streamID)
	http.Redirect(w, r, "https://id.twitch.tv/oauth2/authorize?client_id="+clientID+"&redirect_uri="+redirectURL+"&response_type=code&scope=channel_read user_read channel_editor channel_stream&state="+id, http.StatusSeeOther)
}

// TwitchAuthCallback ..
func (c *ApplicationContext) TwitchAuthCallback(w http.ResponseWriter, r *http.Request) {
	redisConn := c.RedisPool.Get()
	defer redisConn.Close()

	id := r.FormValue("state")
	rawStreamID, err := redisConn.Do("GET", id)
	redisConn.Do("DELETE", id)
	if err != nil {
		fmt.Println("Error occured")
		return
	}
	streamID, _ := strconv.Atoi(string(rawStreamID.([]byte)))

	token := r.FormValue("code")

	client := &http.Client{}

	// Exchange authorization code for access token
	req, _ := http.NewRequest("POST", "https://id.twitch.tv/oauth2/token?client_id="+clientID+"&client_secret="+clientSecret+"&code="+token+"&grant_type=authorization_code&redirect_uri="+redirectURL, nil)
	res, err := client.Do(req)
	body, _ := ioutil.ReadAll(res.Body)
	var b interface{}
	json.Unmarshal(body, &b)
	accessToken := b.(map[string]interface{})["access_token"].(string)

	req, _ = http.NewRequest("GET", "https://api.twitch.tv/kraken/channel", nil)
	req.Header.Add("Client-ID", clientID)
	req.Header.Add("Authorization", "OAuth "+accessToken)
	res, err = client.Do(req)
	if err != nil {
		fmt.Println("Twitch api error")
	}
	body, _ = ioutil.ReadAll(res.Body)
	json.Unmarshal(body, &b)

	channel := &models.Channel{
		Name:     "Twitch",
		URL:      "rtmp://live-sin.twitch.tv/app",
		Key:      b.(map[string]interface{})["stream_key"].(string),
		StreamID: streamID,
		Enabled:  true,
	}

	c.DB.Save(channel)
	http.Redirect(w, r, os.Getenv("CLIENT_ENDPOINT")+"/streams/"+strconv.Itoa(streamID)+"/dashboard", http.StatusSeeOther)
}
