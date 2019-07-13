package controllers

import (
	"context"
	"fmt"
	"net"
	"os"

	"github.com/Ranganaths/go-rtmp-grpc/pkg/api/v1"
	"github.com/Ranganaths/go-rtmp-web-server/models"
	"google.golang.org/grpc"
)

// UserChannelServiceServer ..
type UserChannelServiceServer struct {
	AppContext *ApplicationContext
}

// Get ..
func (s *UserChannelServiceServer) Get(ctx context.Context, r *v1.GetUserChannelRequest) (*v1.GetUserChannelResponse, error) {
	stream := &models.Stream{
		Key: r.GetStreamKey(),
	}
	s.AppContext.DB.Find(stream, stream).Related(&stream.Channels)

	var channels []*v1.UserChannel
	for _, c := range stream.Channels {
		ch := &v1.UserChannel{
			Name:    c.Name,
			URL:     c.URL,
			Key:     c.Key,
			Enabled: c.Enabled,
			ID:      int64(c.ID),
		}
		channels = append(channels, ch)
	}

	return &v1.GetUserChannelResponse{User: &v1.User{ID: int64(stream.UserID)}, StreamID: int64(stream.ID), Channels: channels}, nil
}

// NewRPCServer ..
func NewRPCServer(appContext *ApplicationContext) {
	listener, err := net.Listen("tcp", fmt.Sprintf("%s:%s", os.Getenv("GRPC_HOST"), os.Getenv("GRPC_PORT")))
	if err != nil {
		fmt.Println("Error listening")
		return
	}

	rpcServer := grpc.NewServer()
	v1.RegisterUserChannelServiceServer(rpcServer, &UserChannelServiceServer{
		AppContext: appContext,
	})
	rpcServer.Serve(listener)
}
