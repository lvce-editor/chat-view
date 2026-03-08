import type { ChatDebugViewState } from '../State/ChatDebugViewState.ts'
import * as GetRenderer from '../GetRenderer/GetRenderer.ts'

export const applyRender = (oldState: ChatDebugViewState, newState: ChatDebugViewState, diffResult: readonly number[]): readonly unknown[] => {
  const commands = []
  for (const item of diffResult) {
    const fn = GetRenderer.getRenderer(item)
    const result = fn(oldState, newState)
    if (result.length > 0) {
      commands.push(result)
    }
  }
  return commands
}
