package rtmp

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/exec"
)

// InitPreviewServer ..
func InitPreviewServer(ctx *StreamerContext) {
	for {
		select {
		case streamKey := <-ctx.preview:
			if len(os.Getenv("HLS_OUTPUT")) != 0 {
				go makeHls(ctx, streamKey)
			}
			c := ctx.get(streamKey)
			redisMsg := map[string]interface{}{
				"ID": c.UserID,
				"Message": map[string]interface{}{
					"type":     "stats/previewReady",
					"streamId": c.StreamID,
				},
			}
			redisMsgBytes, _ := json.Marshal(redisMsg)

			ctx.Redis.Do("PUBLISH", "Stream", redisMsgBytes)
		}
	}
}

func makeHls(ctx *StreamerContext, streamKey string) {
	c, ok := ctx.sessions[streamKey]
	if !ok {
		fmt.Println("Not Found", streamKey)
	}
	output := os.Getenv("HLS_OUTPUT") + streamKey
	if _, err := os.Stat(output); err != nil {
		if os.IsNotExist(err) {
			os.MkdirAll(output, os.ModePerm)
		}
	}

	f, err := os.Create(output + "/index.m3u8")
	if err != nil {
		panic(err)
	}
	f.Write([]byte("#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-TARGETDURATION:8\n#EXT-X-MEDIA-SEQUENCE:1"))
	f.Close()

	fmt.Println("Generating preview for", streamKey, c.AppName)
	cmd := exec.Command("ffmpeg", "-v", "verbose", "-i", "rtmp://localhost/"+c.AppName+"/"+streamKey, "-c:v", "libx264", "-c:a", "aac", "-ac", "1", "-strict", "-2", "-crf", "18", "-profile:v", "baseline", "-maxrate", "400k", "-bufsize", "1835k", "-pix_fmt", "yuv420p", "-flags", "-global_header", "-hls_time", "3", "-hls_list_size", "6", "-hls_wrap", "10", "-start_number", "1", output+"/index.m3u8")
	err = cmd.Run()
	os.RemoveAll(output)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("FFMPEG DONE")
}

//ffmpeg -v verbose -i rtmp://localhost/live2/688ecdd5-44ba-4445-95a2-624d58c420bd -c:v libx264 -c:a aac -ac 1 -strict -2 -crf 18 -profile:v baseline -maxrate 400k -bufsize 1835k -pix_fmt yuv420p -flags -global_header -hls_time 3 -hls_list_size 6 -hls_wrap 10 -start_number 1 hls/index.m3u8

// ffmpeg -i demo.mp4 -i demo.mp4 -filter hstack output.mp4

// Not working
// ffmpeg -v verbose -i rtmp://localhost/live2/688ecdd5-44ba-4445-95a2-624d58c420bd -i rtmp://localhost/live2/688ecdd5-44ba-4445-95a2-624d58c420bd -filter hstack -c:v libx264 -c:a aac -ac 1 -strict -2 -crf 18 -profile:v baseline -maxrate 400k -bufsize 1835k -pix_fmt yuv420p -flags -global_header -hls_time 3 -hls_list_size 6 -hls_wrap 10 -start_number 1 hls/index.m3u8

// ffmpeg -i rtmp://localhost/live2/688ecdd5-44ba-4445-95a2-624d58c420bd -i rtmp://localhost/live2/688ecdd5-44ba-4445-95a2-624d58c420bd -filter_complex "[0:v][1:v]hstack=inputs=2[v]" -map "[v]" output.mp4

// ffmpeg -i rtmp://localhost/live2/688ecdd5-44ba-4445-95a2-624d58c420bd -i rtmp://localhost/live2/688ecdd5-44ba-4445-95a2-624d58c420bd -filter_complex "[0:v][1:v]hstack=inputs=2[v]" -map "[v]" -f flv rtmp://localhost/live2/eedd6f60-96dc-4623-9f8a-dc02e6030a09

// ffmpeg -re -i demo.mp4 -vcodec libx264 -profile:v main -preset:v medium -r 30 -g 60 -keyint_min 60 -sc_threshold 0 -b:v 2500k -maxrate 2500k -bufsize 2500k -filter:v scale="trunc(oha/2)2:720" -sws_flags lanczos+accurate_rnd -acodec libfdk_aac -b:a 96k -ar 48000 -ac 2 -f flv rtmp://localhost/live2/688ecdd5-44ba-4445-95a2-624d58c420bd
