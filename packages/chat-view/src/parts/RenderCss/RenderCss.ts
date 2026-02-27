import { ViewletCommand } from '@lvce-editor/constants'
import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'

const css = `.Chat {
  display: grid;
  grid-template-columns: 220px 1fr;
  grid-template-rows: auto 1fr auto;
  height: 100%;
}

.ChatHeader {
  align-items: center;
  display: flex;
  gap: 8px;
  justify-content: space-between;
  padding: 8px;
}

.ChatList {
  border-right: 1px solid var(--Widget-border);
  overflow: auto;
}

.ChatDetails {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.ChatDetailsContent {
  flex: 1;
  overflow: auto;
  padding: 8px;
}

.MultilineInputBox {
  width: 100%;
}
`

export const renderCss = (oldState: StatusBarState, newState: StatusBarState): readonly [string, number, string] => {
  return [ViewletCommand.SetCss, newState.uid, css]
}
