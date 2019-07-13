package controllers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/google/uuid"

	"github.com/Ranganaths/go-rtmp-web-server/models"
)

// AddStream creates a new stream for an user
func (c *ApplicationContext) AddStream(w http.ResponseWriter, r *http.Request) {
	stream := &models.Stream{}
	if err := json.NewDecoder(r.Body).Decode(stream); err != nil {
		c.NewResponse(w).Status(400).SendJSON(Response{
			Error:   true,
			Message: "Unable to parse request",
		})
		return
	}

	stream.Key = uuid.New().String()
	stream.UserID = int(r.Context().Value("id").(float64))

	c.DB.Save(stream)

	c.NewResponse(w).Status(200).SendJSON(Response{
		Message: "Stream created successfully",
	})
}

// ListStreams gives the list of stream that belongs to the user
func (c *ApplicationContext) ListStreams(w http.ResponseWriter, r *http.Request) {
	var streams []models.Stream
	userID := int(r.Context().Value("id").(float64))

	c.DB.Find(&streams, models.Stream{UserID: userID})

	c.NewResponse(w).Status(200).SendJSON(Response{
		Message: "Retrieved stream list successfully",
		Data:    streams,
	})
}

// DeleteStream will remove a stream by ID
func (c *ApplicationContext) DeleteStream(w http.ResponseWriter, r *http.Request) {
	streamID, err := strconv.Atoi(r.FormValue("streamId"))
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

	c.DB.Where("id = ?", streamID).Delete(models.Stream{})

	c.NewResponse(w).Status(200).SendJSON(Response{
		Message: "Deleted stream successfully",
	})
}
