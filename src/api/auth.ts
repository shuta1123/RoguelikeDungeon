import type { AuthResponse } from '../types/api'
import { apiClient } from './client'

export async function register(username: string, password: string): Promise<AuthResponse> {
  const res = await apiClient.post<AuthResponse>('/api/auth/register', { username, password })
  return res.data
}

export async function login(username: string, password: string): Promise<AuthResponse> {
  const res = await apiClient.post<AuthResponse>('/api/auth/login', { username, password })
  return res.data
}
