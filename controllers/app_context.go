package controllers

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/go-chi/chi/middleware"
	"github.com/gomodule/redigo/redis"
	"github.com/rs/cors"

	"github.com/jinzhu/gorm"
)

// 813004830141-2leap7abkjf00bsofqcdn6a6po8l9348.apps.googleusercontent.com

// ApplicationContext data which has to be passed to all the controllers.
//
// Note all the data you put into this are safe for concurrent access
type ApplicationContext struct {
	DB        *gorm.DB
	Hub       *WSHub
	PubSub    *PubSub
	RedisPool *redis.Pool
}

// HandlerFunc is a custom handler
type HandlerFunc func(ResponseWriter, *http.Request)

// ResponseWriter is our custom wrapper over http.ResponseWriter
type ResponseWriter struct {
	http.ResponseWriter
}

// Response is the object used as a json template for http response
type Response struct {
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
	Error   bool        `json:"error"`
}

// Write calls http.ResponseWriter.Write
// It will write bytes into response
func (r ResponseWriter) Write(b []byte) (int, error) {
	return r.ResponseWriter.Write(b)
}

// WriteHeader calls http.ResponseWriter.WriteHeader
// Sets http status code
func (r ResponseWriter) WriteHeader(statusCode int) {
	r.ResponseWriter.WriteHeader(statusCode)
}

// Header calls http.ResponseWriter.Header
// Returns http header
func (r ResponseWriter) Header() http.Header {
	return r.ResponseWriter.Header()
}

// Status will set the http status code, and returns the same object
func (r ResponseWriter) Status(statusCode int) ResponseWriter {
	r.ResponseWriter.WriteHeader(statusCode)
	return r
}

// SendJSON will write JSON data to response
func (r ResponseWriter) SendJSON(data Response) error {
	if err := json.NewEncoder(r.ResponseWriter).Encode(data); err != nil {
		return err
	}
	return nil
}

// NewResponse ..
func (c *ApplicationContext) NewResponse(w http.ResponseWriter) ResponseWriter {
	return ResponseWriter{w}
}

// RecoveryHandler returns 500 status when handler panics.
// Writes error to application log
func (c *ApplicationContext) RecoveryHandler(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var err error
		defer func() {
			if e := recover(); e != nil {
				switch t := e.(type) {
				case string:
					err = errors.New(t)
				case error:
					err = t
				default:
					err = errors.New("Unknown error")
				}
				log.Panicln(err.Error())
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}
		}()

		h.ServeHTTP(w, r)
	})
}

// CORSHandler handles cors requests
func (c *ApplicationContext) CORSHandler(h http.Handler) http.Handler {
	return cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedHeaders: []string{"authorization", "content-type"},
		AllowedMethods: []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete},
	}).Handler(h)
}

// LogHandler writes access log
func (c *ApplicationContext) LogHandler(h http.Handler) http.Handler {
	return middleware.DefaultLogger(h)
}

// Authentication middleware decode the jwt token found in 'Authorization' header
// and add the decoded information to the request context
func (c *ApplicationContext) Authentication(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authToken := r.Header.Get("Authorization")
		if authToken == "" {
			authToken = getCookieByName(r.Cookies(), "token")
		}

		token, err := VerifyJWT(authToken)
		if err != nil || !token.Valid {
			c.NewResponse(w).Status(403).SendJSON(Response{
				Error:   true,
				Message: "Unauthorized",
			})
			return
		}

		claims := token.Claims.(jwt.MapClaims)
		ctx := context.WithValue(r.Context(), "email", claims["email"])
		ctx = context.WithValue(ctx, "id", claims["id"])
		next(w, r.WithContext(ctx))
	}
}

// Logging logs the incoming requests
func Logging(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		fmt.Println(r.Method, r.RequestURI)
		next(w, r)
	}
}

func getCookieByName(cookie []*http.Cookie, name string) string {
	cookieLen := len(cookie)
	result := ""
	for i := 0; i < cookieLen; i++ {
		if cookie[i].Name == name {
			result = cookie[i].Value
			break
		}
	}
	return result
}
