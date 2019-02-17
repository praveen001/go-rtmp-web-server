package router

import "github.com/go-chi/chi"

// streamRouter Add channel route handlers
func (cr *CustomRouter) streamRouter() *chi.Mux {
	router := chi.NewRouter()

	router.Post("/add", cr.Authentication(cr.AddStream))
	router.Get("/list", cr.Authentication(cr.ListStreams))
	router.Delete("/delete", cr.Authentication(cr.DeleteStream))
	return router
}
