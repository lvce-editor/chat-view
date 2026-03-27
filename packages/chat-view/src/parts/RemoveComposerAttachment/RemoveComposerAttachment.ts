import type { ChatState } from '../ChatState/ChatState.ts'
import { handleRemoveComposerAttachment } from '../HandleRemoveComposerAttachment/HandleRemoveComposerAttachment.ts'

export const removeComposerAttachment = async (state: ChatState, attachmentId: string): Promise<ChatState> => {
  return handleRemoveComposerAttachment(state, attachmentId)
}
