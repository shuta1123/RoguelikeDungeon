import type { JobClass } from '../types/player'
import type { Direction, StartRunResponse, MoveResponse, DescendResponse } from '../types/dungeon'
import { wsClient } from './wsClient'
import { apiClient } from './client'
import type { GhostResponse } from '../types/dungeon'

export async function startRun(jobClass: JobClass): Promise<StartRunResponse> {
  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('userId') ?? undefined
  const username = localStorage.getItem('username') ?? '冒険者'
  return wsClient.request('dungeon/start', { jobClass, userId, username, token }, 'dungeon/started')
}

export async function move(runId: string, direction: Direction): Promise<MoveResponse> {
  return wsClient.request('dungeon/move', { runId, direction }, 'dungeon/moved')
}

export async function descend(runId: string): Promise<DescendResponse> {
  return wsClient.request('dungeon/descend', { runId }, 'dungeon/descended')
}

export async function fetchGhosts(floor: number): Promise<GhostResponse> {
  const res = await apiClient.get<GhostResponse>(`/api/ghosts?floor=${floor}`)
  return res.data
}
