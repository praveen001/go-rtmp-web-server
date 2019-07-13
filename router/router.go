package router

import (
	"net/http"
	"os"

	"github.com/Ranganaths/go-rtmp-web-server/controllers"
	"github.com/go-chi/chi"
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

	cr.Route("/v1", func(r chi.Router) {
		r.Mount("/api/users", cr.userRouter())
		r.Mount("/api/streams", cr.streamRouter())
		r.Mount("/api/channels", cr.channelRouter())
		r.Mount("/api/ws", cr.websocketRouter())

		fs := http.FileServer(http.Dir(os.Getenv("HLS_OUTPUT")))
		r.Mount("/api/hls/{streamKey}/{file}", http.StripPrefix("/v1/api/hls/", fs))
	})

	return cr
}
