import { ViewletCommand } from '@lvce-editor/constants'
import { diffTree } from '@lvce-editor/virtual-dom-worker'
import type { ChatState } from '../ChatState/ChatState.ts'
import { renderItems } from '../RenderItems/RenderItems.ts'

const getSelectedSessionToolCallSignature = (state: ChatState): string => {
  const selectedSession = state.sessions.find((session) => session.id === state.selectedSessionId)
  if (!selectedSession) {
    return ''
  }
  return selectedSession.messages.map((message) => `${message.id}:${JSON.stringify(message.toolCalls || [])}`).join('|')
}

export const renderIncremental = (oldState: ChatState, newState: ChatState): any => {
  const oldToolCallSignature = getSelectedSessionToolCallSignature(oldState)
  const newToolCallSignature = getSelectedSessionToolCallSignature(newState)
  if (oldToolCallSignature !== newToolCallSignature) {
    return renderItems(oldState, newState)
  }
  const oldDom = renderItems(oldState, oldState)[2]
  const newDom = renderItems(newState, newState)[2]
  console.log({ newDom, newState })
  const patches = diffTree(oldDom, newDom)
  return [ViewletCommand.SetPatches, newState.uid, patches]
}
