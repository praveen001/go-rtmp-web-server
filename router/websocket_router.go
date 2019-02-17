package router

import (
	"github.com/go-chi/chi"
)

// websocketRouter Add channel route handlers
func (cr *CustomRouter) websocketRouter() *chi.Mux {
	router := chi.NewRouter()

	router.Get("/connect", cr.HandleWebsocket)

	return router
}
