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
	http.Redirect(w, r, "https://id.twitch.tv/oauth2/authorize?client_id="+clientID+"&redirect_uri="+redirectURL+"&response_type=code&scope=channel:read:stream_key channel_read user_read channel_editor channel_stream&state="+id, http.StatusSeeOther)
}

// TwitchAuthCallback ..
func (c *ApplicationContext) TwitchAuthCallback(w http.ResponseWriter, r *http.Request) {
	redisConn := c.RedisPool.Get()
	defer redisConn.Close()

	id := r.FormValue("state")
	rawStreamID, err := redisConn.Do("GET", id)
	redisConn.Do("DELETE", id)
	if err != nil {
		fmt.Println("Error occured", err)
		return
	}
	streamID, _ := strconv.Atoi(string(rawStreamID.([]byte)))

	token := r.FormValue("code")

	client := &http.Client{}

	// Exchange authorization code for access token
	req, _ := http.NewRequest("POST", "https://id.twitch.tv/oauth2/token?client_id="+clientID+"&client_secret="+clientSecret+"&code="+token+"&grant_type=authorization_code&redirect_uri="+redirectURL, nil)
	res, err := client.Do(req)
	if err != nil {
		fmt.Println("Twitch Request Error 1", err)
		return
	}

	// Read the body
	body, _ := ioutil.ReadAll(res.Body)
	var response1 struct {
		AccessToken string `json:"access_token"`
	}

	if err := json.Unmarshal(body, &response1); err != nil {
		fmt.Println("Unable to read response 1", err)
	}
	accessToken := response1.AccessToken

	// Validate the access token
	req, _ = http.NewRequest("GET", "https://id.twitch.tv/oauth2/validate", nil)
	req.Header.Add("Authorization", "OAuth "+accessToken)
	res, err = client.Do(req)
	if err != nil {
		fmt.Println("Unable to validate twitch access token", err)
	}

	body, _ = ioutil.ReadAll(res.Body)
	var response2 struct {
		UserID string `json:"user_id"`
	}

	if err := json.Unmarshal(body, &response2); err != nil {
		fmt.Println("Unable to read response 2", err)
	}
	twitchUserID := response2.UserID

	// Get Stream Key
	req, _ = http.NewRequest("GET", "https://api.twitch.tv/helix/streams/key?broadcaster_id="+twitchUserID, nil)
	req.Header.Add("Client-ID", clientID)
	req.Header.Add("Authorization", "Bearer "+accessToken)
	res, err = client.Do(req)
	if err != nil {
		fmt.Println("Twitch Request Error 2", err)
	}

	body, _ = ioutil.ReadAll(res.Body)
	var response3 struct {
		Data []struct {
			StreamKey string `json:"stream_key"`
		} `json:"data"`
	}

	if err := json.Unmarshal(body, &response3); err != nil {
		fmt.Println("Unable to read response 3", err)
	}

	channel := &models.Channel{
		Name:     "Twitch",
		URL:      "rtmp://live-sin.twitch.tv/app",
		Key:      response3.Data[0].StreamKey,
		StreamID: streamID,
		Enabled:  true,
	}
	c.DB.Save(channel)

	http.Redirect(w, r, os.Getenv("CLIENT_ENDPOINT")+"/streams/"+strconv.Itoa(streamID)+"/dashboard", http.StatusSeeOther)
}
