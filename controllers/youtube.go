package controllers

import (
	"fmt"
	"net/http"
	"os"
	"strconv"

	"github.com/google/uuid"
	"github.com/praveen001/go-rtmp-web-server/models"
	"golang.org/x/net/context"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/youtube/v3"
)

var conf *oauth2.Config

// InitYoutube will initialize a youtube config
func InitYoutube() {
	conf = &oauth2.Config{
		ClientID:     os.Getenv("YOUTUBE_CLIENT_ID"),
		ClientSecret: os.Getenv("YOUTUBE_CLIENT_SECRET"),
		RedirectURL:  os.Getenv("API_ENDPOINT") + os.Getenv("YOUTUBE_REDIRECT_URL"),
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/youtube.readonly",
			"https://www.googleapis.com/auth/youtubepartner-channel-audit",
		},
		Endpoint: google.Endpoint,
	}
}

// GoogleAuth ..
func (c *ApplicationContext) GoogleAuth(w http.ResponseWriter, r *http.Request) {
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
	http.Redirect(w, r, conf.AuthCodeURL(id), http.StatusSeeOther)
}

// GoogleAuthCallback ..
func (c *ApplicationContext) GoogleAuthCallback(w http.ResponseWriter, r *http.Request) {
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

	code := r.FormValue("code")

	// Exchange authorization code for access token
	token, err := conf.Exchange(context.Background(), code)
	if err != nil {
		fmt.Println("Error occured", err.Error())
		return
	}

	// Create a youtube api client
	y, _ := youtube.New(conf.Client(context.Background(), token))

	// live broadcast list api call to get default live broadcast
	liveBroadcastListResponse, err := y.LiveBroadcasts.List([]string{"id", "status", "snippet", "contentDetails"}).BroadcastType("persistent").Mine(true).Do()
	if err != nil {
		c.NewResponse(w).Status(200).SendJSON(Response{
			Data: err.Error(),
		})
		return
	}
	boundStreamID := liveBroadcastListResponse.Items[0].ContentDetails.BoundStreamId

	// live stream list api call to get default live stream associated to default live broadcast using bound stream id of live broadcast
	liveStreamListResponse, err := y.LiveStreams.List([]string{"id", "status", "snippet", "cdn"}).Id(boundStreamID).Do()
	if err != nil {
		c.NewResponse(w).Status(200).SendJSON(Response{
			Data: err.Error(),
		})
		return
	}
	defaultStream := liveStreamListResponse.Items[0]

	// Create the youtube channel
	channel := &models.Channel{
		Name:     "Youtube",
		URL:      defaultStream.Cdn.IngestionInfo.IngestionAddress,
		Key:      defaultStream.Cdn.IngestionInfo.StreamName,
		StreamID: streamID,
		Enabled:  true,
	}

	// Add the channel and save it
	c.DB.Save(channel)
	http.Redirect(w, r, os.Getenv("CLIENT_ENDPOINT")+"/streams/"+strconv.Itoa(streamID)+"/dashboard", http.StatusSeeOther)
}
