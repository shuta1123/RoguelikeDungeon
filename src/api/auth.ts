import type { AuthResponse } from '../types/api'

// TODO: [API] POST /api/auth/register — ここを実際のAPIに置き換える
// 現在は静的モックデータを使用
export async function register(_username: string, _password: string): Promise<AuthResponse> {
  await new Promise((r) => setTimeout(r, 300))
  return { token: 'mock-token-001', user: { id: 'user-001', username: _username } }
}

// TODO: [API] POST /api/auth/login — ここを実際のAPIに置き換える
// 現在は静的モックデータを使用
export async function login(_username: string, _password: string): Promise<AuthResponse> {
  await new Promise((r) => setTimeout(r, 300))
  return { token: 'mock-token-001', user: { id: 'user-001', username: _username } }
}
