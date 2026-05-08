const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws'

type Handler = (payload: unknown) => void

class WSClient {
  private ws: WebSocket | null = null
  private handlers = new Map<string, Set<Handler>>()
  private connectPromise: Promise<void> | null = null

  connect(): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN) return Promise.resolve()
    if (this.connectPromise) return this.connectPromise

    this.connectPromise = new Promise((resolve, reject) => {
      const ws = new WebSocket(WS_URL)
      ws.onopen = () => {
        this.ws = ws
        this.connectPromise = null
        resolve()
      }
      ws.onerror = () => {
        this.connectPromise = null
        reject(new Error('WebSocket connection failed'))
      }
      ws.onclose = () => {
        this.ws = null
        this.connectPromise = null
      }
      ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data) as { type: string; payload: unknown }
          this.handlers.get(msg.type)?.forEach((h) => h(msg.payload))
        } catch {
          // ignore malformed messages
        }
      }
    })
    return this.connectPromise
  }

  on(type: string, handler: Handler) {
    if (!this.handlers.has(type)) this.handlers.set(type, new Set())
    this.handlers.get(type)!.add(handler)
  }

  off(type: string, handler: Handler) {
    this.handlers.get(type)?.delete(handler)
  }

  send(type: string, payload: unknown) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket not connected')
    }
    this.ws.send(JSON.stringify({ type, payload }))
  }

  // 送って1回だけ応答を受け取る
  async request<T>(sendType: string, payload: unknown, responseType: string): Promise<T> {
    await this.connect()
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.off(responseType, onMessage)
        this.off('error', onError)
        reject(new Error(`timeout waiting for ${responseType}`))
      }, 10000)

      const onMessage = (data: unknown) => {
        clearTimeout(timeout)
        this.off(responseType, onMessage)
        this.off('error', onError)
        resolve(data as T)
      }
      const onError = (data: unknown) => {
        clearTimeout(timeout)
        this.off(responseType, onMessage)
        this.off('error', onError)
        reject(new Error((data as { message?: string })?.message ?? 'server error'))
      }

      this.on(responseType, onMessage)
      this.on('error', onError)
      this.send(sendType, payload)
    })
  }
}

export const wsClient = new WSClient()
