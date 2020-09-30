package router

import (
	"net/http"

	"github.com/go-chi/chi"
	"github.com/praveen001/go-rtmp-web-server/controllers"
)

// CustomRouter wrapped mux router
type CustomRouter struct {
	*chi.Mux
	*controllers.ApplicationContext
}

func (cr *CustomRouter) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	cr.Mux.ServeHTTP(w, r)
}

// New initializes the application's router
func New(ctx *controllers.ApplicationContext) http.Handler {
	cr := &CustomRouter{
		chi.NewMux(),
		ctx,
	}

	cr.Use(ctx.CORSHandler, ctx.LogHandler, ctx.RecoveryHandler)

	cr.Mount("/ws", cr.websocketRouter())

	cr.Route("/v1", func(r chi.Router) {
		r.Mount("/api/users", cr.userRouter())
		r.Mount("/api/streams", cr.streamRouter())
		r.Mount("/api/channels", cr.channelRouter())
	})

	return cr
}
