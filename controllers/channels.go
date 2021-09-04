package controllers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/praveen001/go-rtmp-web-server/models"
)

// AddChannel a new channel for a given user
func (c *ApplicationContext) AddChannel(w http.ResponseWriter, r *http.Request) {
	channel := &models.Channel{}
	if err := json.NewDecoder(r.Body).Decode(channel); err != nil {
		c.NewResponse(w).Status(400).SendJSON(Response{
			Error:   true,
			Message: "Unable to parse request",
		})
		return
	}
	channel.Enabled = true

	stream := &models.Stream{
		Model: models.Model{
			ID: channel.StreamID,
		},
	}
	c.DB.Find(&stream, stream)
	if stream.UserID != int(r.Context().Value("id").(float64)) {
		c.NewResponse(w).Status(403).SendJSON(Response{
			Error:   true,
			Message: "Unauthorized",
		})
		return
	}

	c.DB.Save(channel)

	c.NewResponse(w).Status(200).SendJSON(Response{
		Error:   false,
		Message: "Channel added successfully",
	})
}

// ListChannels all channels associated to a stream
func (c *ApplicationContext) ListChannels(w http.ResponseWriter, r *http.Request) {
	streamID, err := strconv.Atoi(r.FormValue("streamId"))
	if err != nil {
		c.NewResponse(w).Status(400).SendJSON(Response{
			Error:   true,
			Message: "Invalid stream ID",
		})
		return
	}

	var channels []models.Channel
	c.DB.Find(&channels, models.Channel{StreamID: streamID})

	c.NewResponse(w).Status(http.StatusOK).SendJSON(Response{
		Data: channels,
	})
}

// DeleteChannel will delete a channel associated to a stream
func (c *ApplicationContext) DeleteChannel(w http.ResponseWriter, r *http.Request) {
	streamID, err := strconv.Atoi(r.FormValue("streamId"))
	if err != nil {
		c.NewResponse(w).Status(400).SendJSON(Response{
			Error:   true,
			Message: "Invalid stream ID",
		})
		return
	}
	channelID, err := strconv.Atoi(r.FormValue("channelId"))
	if err != nil {
		c.NewResponse(w).Status(400).SendJSON(Response{
			Error:   true,
			Message: "Invalid stream ID",
		})
		return
	}

	// Access check
	stream := &models.Stream{
		Model: models.Model{
			ID: streamID,
		},
	}
	c.DB.Find(&stream, stream)
	if stream.UserID != int(r.Context().Value("id").(float64)) {
		c.NewResponse(w).Status(403).SendJSON(Response{
			Error:   true,
			Message: "Unauthorized",
		})
		return
	}

	channel := &models.Channel{
		StreamID: streamID,
		Model: models.Model{
			ID: channelID,
		},
	}

	c.DB.Delete(channel)

	c.NewResponse(w).Status(200).SendJSON(Response{
		Message: "Channel has been deleted successfully",
	})
}
