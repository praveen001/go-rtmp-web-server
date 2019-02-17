package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"

	"github.com/gomodule/redigo/redis"
	"google.golang.org/grpc"

	"github.com/praveen001/go-rtmp-grpc/pkg/api/v1"
	"github.com/praveen001/go-rtmp-web-server/controllers"
	"github.com/praveen001/go-rtmp-web-server/models"
	"github.com/praveen001/go-rtmp-web-server/router"
	"github.com/praveen001/go-rtmp-web-server/rtmp"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

func main() {
	switch os.Args[1] {
	case "rtmp":
		rtmpServer()
	case "web":
		webServer()
	default:
		fmt.Println("Server mode should be streamer or web")
	}
}

func rtmpServer() {
	conn, err := grpc.Dial(fmt.Sprintf("%s:%s", os.Getenv("GRPC_HOST"), os.Getenv("GRPC_PORT")), grpc.WithInsecure())
	if err != nil {
		fmt.Println("GRPC Connection Error")
		return
	}
	rpcClient := v1.NewUserChannelServiceClient(conn)

	redisClient, err := redis.Dial("tcp", fmt.Sprintf("%s:%s", os.Getenv("REDIS_HOST"), os.Getenv("REDIS_PORT")))
	if err != nil {
		panic("Unable to connect to Redis" + err.Error())
	}

	ctx := &rtmp.StreamerContext{
		RPC:   rpcClient,
		Redis: redisClient,
	}

	rtmp.InitServer(ctx)

	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)

	// Block till we receive an interrupt
	<-c

	os.Exit(0)
}

func webServer() {
	controllers.InitYoutube()
	controllers.InitTwitch()
	fmt.Println(os.Environ())

	// MySQL DB
	db, err := gorm.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s)/%s?parseTime=true", os.Getenv("MYSQL_USER"), os.Getenv("MYSQL_PASSWORD"), os.Getenv("MYSQL_HOST"), os.Getenv("MYSQL_DATABASE")))
	if err != nil {
		panic("Unable to connect to database " + err.Error())
	}
	db.AutoMigrate(&models.User{}, &models.Stream{}, &models.Channel{})
	defer db.Close()

	// Websocket
	hub := controllers.NewHub()
	go hub.Run()

	// Redis PubSub
	redisPool := &redis.Pool{
		MaxIdle:   80,
		MaxActive: 100,
		Dial: func() (redis.Conn, error) {
			c, err := redis.Dial("tcp", fmt.Sprintf("%s:%s", os.Getenv("REDIS_HOST"), os.Getenv("REDIS_PORT")))
			if err != nil {
				panic("Redis connection failed " + err.Error())
			}
			return c, err
		},
	}
	pubsub := controllers.NewPubSub(redisPool.Get(), "Stream")
	go pubsub.Listen(hub)
	defer pubsub.Close()

	appContext := &controllers.ApplicationContext{
		DB:        db,
		Hub:       hub,
		PubSub:    pubsub,
		RedisPool: redisPool,
	}

	// Grpc
	go controllers.NewRPCServer(appContext)

	// Create a HTTP Server instance
	srv := &http.Server{
		Addr:    fmt.Sprintf("%s:%s", os.Getenv("HTTP_HOST"), os.Getenv("HTTP_PORT")),
		Handler: router.New(appContext),
	}

	// Run the server in a goroutine
	go func() {
		if err := srv.ListenAndServe(); err != nil {
			panic(err)
		}
	}()
	// go rtmp.InitServer(db)
	fmt.Println("Started server at port 5000")

	// Create a channel to listen for OS Interrupts
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)

	// Block till we receive an interrupt
	<-c

	// Wait for timeout to complete
	ctx, cancel := context.WithTimeout(context.Background(), 30)
	defer cancel()

	// Shutdown the server
	srv.Shutdown(ctx)
	os.Exit(0)
}
