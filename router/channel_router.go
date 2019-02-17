package router

import (
	"github.com/go-chi/chi"
)

// channelRouter Add channel route handlers
func (cr *CustomRouter) channelRouter() *chi.Mux {
	router := chi.NewRouter()

	router.Post("/add", cr.Authentication(cr.AddChannel))
	router.Get("/list", cr.Authentication(cr.ListChannels))
	router.Delete("/delete", cr.Authentication(cr.DeleteChannel))

	router.Get("/youtube", cr.Authentication(cr.GoogleAuth))
	router.Get("/youtube/callback", cr.Authentication(cr.GoogleAuthCallback))

	router.Get("/twitch", cr.Authentication(cr.TwitchAuth))
	router.Get("/twitch/callback", cr.Authentication(cr.TwitchAuthCallback))

	return router
}
