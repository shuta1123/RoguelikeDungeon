package main

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/shuta1123/RoguelikeDungeon/server/handler"
	"github.com/shuta1123/RoguelikeDungeon/server/ws"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // 開発中は全許可、本番では origin チェックを入れる
	},
}

func main() {
	hub := ws.NewHub()
	go hub.Run()

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Printf("upgrade error: %v", err)
			return
		}

		client := ws.NewClient(hub, conn)
		hub.Register(client)

		go client.WritePump()
		client.ReadPump(handler.Handle)
	})

	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	})

	log.Println("server listening on :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}
