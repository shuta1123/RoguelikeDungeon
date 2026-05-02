import type { BattleAction, BattleResponse } from '../types/battle'
import { mockInitialBattleState, mockAttackResponse, mockWinBattleState } from '../mocks/mockBattle'

let _turnCount = 0

// TODO: [API] POST /api/battle/action — ここを実際のAPIに置き換える
// ※ ダメージ計算・シナジー判定・状態異常適用はすべてGoが行う
// ※ フロントはアクションを送って結果を受け取り表示するだけ
// 現在は静的モックデータを使用
export async function sendBattleAction(_runId: string, action: BattleAction): Promise<BattleResponse> {
  await new Promise((r) => setTimeout(r, 400))
  _turnCount++

  if (action.type === 'escape') {
    _turnCount = 0
    return {
      battleState: { ...mockInitialBattleState, phase: 'escaped', isActive: false },
      log: [{ id: `log-escape-${_turnCount}`, message: '逃げ出した！', type: 'system' }],
    }
  }

  if (_turnCount >= 3) {
    _turnCount = 0
    return { battleState: mockWinBattleState, log: mockWinBattleState.log }
  }

  const state = { ...mockAttackResponse, turn: _turnCount + 1 }
  return { battleState: state, log: state.log }
}

export function resetBattleMock() {
  _turnCount = 0
}
