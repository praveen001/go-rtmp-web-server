package router

import (
	"github.com/go-chi/chi"
)

// userRouter Add user route handlers
func (cr *CustomRouter) userRouter() *chi.Mux {
	router := chi.NewRouter()

	router.Post("/register", cr.RegisterUser)
	router.Get("/verify", cr.VerifyUser)
	router.Post("/login", cr.LoginUser)
	router.Get("/tokeninfo", cr.Authentication(cr.TokenInfo))

	return router
}
