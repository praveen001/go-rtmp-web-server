
```
go get -u github.com/praveen001/go-rtmp-web-server
```

Just a learning project. 

# RTMP Restreaming Server

Restreaming server that can stream to Youtube, Twitch and Custom RTMP servers. Like [restream.io](https://restream.io)

It consists of three components:
	* Web server - Provides APIs for authentication, channel listing and creation, etc.
	* RTMP restreaming server - RTMP Server that can receive a stream and distribute to multiple endpoints.
	* Frontend - User interface.

![Screenshot](https://raw.githubusercontent.com/praveen001/go-rtmp-web-server/master/screenshot.png)

# Running in development mode

```
docker-compose up
```

# Running in production mode

Production mode will run in a kubernetes cluster. 

```
kubectl apply -f ./k8s/
```
