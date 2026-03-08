import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'

interface ChatViewEventBase {
  readonly sessionId: string
  readonly timestamp: string
}

export interface ChatSessionCreatedEvent extends ChatViewEventBase {
  readonly type: 'chat-session-created'
  readonly title: string
}

export interface ChatSessionDeletedEvent extends ChatViewEventBase {
  readonly type: 'chat-session-deleted'
}

export interface ChatSessionTitleUpdatedEvent extends ChatViewEventBase {
  readonly type: 'chat-session-title-updated'
  readonly title: string
}

export interface ChatMessageAddedEvent extends ChatViewEventBase {
  readonly type: 'chat-message-added'
  readonly message: ChatMessage
}

export interface ChatMessageUpdatedEvent extends ChatViewEventBase {
  readonly type: 'chat-message-updated'
  readonly inProgress: boolean | undefined
  readonly messageId: string
  readonly text: string
  readonly time: string
}

export interface ChatSessionMessagesReplacedEvent extends ChatViewEventBase {
  readonly type: 'chat-session-messages-replaced'
  readonly messages: readonly ChatMessage[]
}

export interface HandleInputEvent extends ChatViewEventBase {
  readonly type: 'handle-input'
  readonly value: string
}

export interface HandleSubmitEvent extends ChatViewEventBase {
  readonly type: 'handle-submit'
  readonly value: string
}

export interface HandleResponseChunkEvent extends ChatViewEventBase {
  readonly type: 'handle-response-chunk'
  readonly content: string
  readonly messageId: string
}

export type ChatViewEvent =
  | ChatSessionCreatedEvent
  | ChatSessionDeletedEvent
  | ChatSessionTitleUpdatedEvent
  | ChatMessageAddedEvent
  | ChatMessageUpdatedEvent
  | ChatSessionMessagesReplacedEvent
  | HandleInputEvent
  | HandleSubmitEvent
  | HandleResponseChunkEvent
