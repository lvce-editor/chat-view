import type { ChatSession } from '../ChatSession/ChatSession.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getChatSessionStatus } from '../GetChatSessionStatus/GetChatSessionStatus.ts'

export const getSessionStatusClassName = (session: ChatSession): string => {
  const status = getChatSessionStatus(session)
  if (status === 'in-progress') {
    return ClassNames.ChatListItemStatusInProgress
  }
  if (status === 'finished') {
    return ClassNames.ChatListItemStatusFinished
  }
  return ClassNames.ChatListItemStatusStopped
}
