Just a learning project.

```
go get -u github.com/praveen001/go-rtmp-web-server
```

# RTMP Restreaming Server

Similar to [restream.io](#https://restream.io).

    - [Development setup]()
    - [Production setup]()

# Start server for development

It consists of three components - a web server, RTMP restreaming server and frontend. You have to start them individually.

It uses a .env file from ./scripts/dev.env for all the configurations

**Clone the project**
go get -u github.com/praveen001/go-rtmp-web-server

**Start web server**

```
set -o allexport
[[ -f ./scripts/dev.env ]] && source ./scripts/dev.env
set +o allexport
go run main.go web
```

**Start RTMP server**

```
set -o allexport
[[ -f ./scripts/dev.env ]] && source ./scripts/dev.env
set +o allexport
go run main.go rtmp
```

**Start frontend**

```
cd frontend
yarn
yarn start
```

# Start server in production mode

All the components are wrapped in docker. Just run docker compose.

It uses a .env file from ./scripts/prod.env for all the configurations.

```
docker-compose up
```
