import type { BattleAction, BattleResponse } from '../types/battle'
import { wsClient } from './wsClient'

export async function sendBattleAction(runId: string, action: BattleAction): Promise<BattleResponse> {
  return wsClient.request('battle/action', { runId, action }, 'battle/result')
}
