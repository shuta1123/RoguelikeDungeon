package model

import "encoding/json"

// クライアント → サーバー
type InMessage struct {
	Type    string          `json:"type"`
	Payload json.RawMessage `json:"payload"`
}

// サーバー → クライアント
type OutMessage struct {
	Type    string `json:"type"`
	Payload any    `json:"payload"`
}

// エラー応答
type ErrorPayload struct {
	Message string `json:"message"`
}
