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
		return true // 開発中は全許可
	},
}

func withCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, X-User-ID, Authorization")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next(w, r)
	}
}

func main() {
	hub := ws.NewHub()
	go hub.Run()

	// WebSocket
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

	// REST
	http.HandleFunc("/api/auth/register", withCORS(handler.RegisterHandler))
	http.HandleFunc("/api/auth/login", withCORS(handler.LoginHandler))
	http.HandleFunc("/api/player/meta", withCORS(handler.PlayerMetaHandler))
	http.HandleFunc("/api/player/meta/upgrade", withCORS(handler.PurchaseUpgradeHandler))
	http.HandleFunc("/api/ranking", withCORS(handler.RankingHandler))
	http.HandleFunc("/api/ghosts", withCORS(handler.GhostsHandler))

	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("ok"))
	})

	log.Println("server listening on :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}
