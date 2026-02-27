import { ViewletCommand } from '@lvce-editor/constants'
import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'
import { getChatVirtualDom } from '../GetStatusBarVirtualDom/GetStatusBarVirtualDom.ts'

export const renderItems = (oldState: StatusBarState, newState: StatusBarState): any => {
  const { composerValue, initial, selectedSessionId, sessions, uid } = newState
  if (initial) {
    return [ViewletCommand.SetDom2, uid, []]
  }
  const dom = getChatVirtualDom(sessions, selectedSessionId, composerValue)
  return [ViewletCommand.SetDom2, uid, dom]
}
