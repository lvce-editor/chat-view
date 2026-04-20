import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type { ChatToolCall } from '../ChatMessage/ChatMessage.ts'
import type { ChatViewEvent } from '../ChatViewEvent/ChatViewEvent.ts'

const getResponseOutputText = (parsed: unknown): string => {
  if (!parsed || typeof parsed !== 'object') {
    return ''
  }

  const outputText = Reflect.get(parsed, 'output_text')
  if (typeof outputText === 'string') {
    return outputText
  }

  const output = Reflect.get(parsed, 'output')
  if (!Array.isArray(output)) {
    return ''
  }

  const chunks: string[] = []
  for (const outputItem of output) {
    if (!outputItem || typeof outputItem !== 'object') {
      continue
    }
    if (Reflect.get(outputItem, 'type') !== 'message') {
      continue
    }
    const content = Reflect.get(outputItem, 'content')
    if (!Array.isArray(content)) {
      continue
    }
    for (const part of content) {
      if (!part || typeof part !== 'object') {
        continue
      }
      const partType = Reflect.get(part, 'type')
      const text = Reflect.get(part, 'text')
      if ((partType === 'output_text' || partType === 'text') && typeof text === 'string') {
        chunks.push(text)
      }
    }
  }
  return chunks.join('')
}

const getResponseToolCalls = (parsed: unknown): readonly ChatToolCall[] | undefined => {
  if (!parsed || typeof parsed !== 'object') {
    return undefined
  }
  const output = Reflect.get(parsed, 'output')
  if (!Array.isArray(output)) {
    return undefined
  }
  const toolCalls: ChatToolCall[] = []
  for (const outputItem of output) {
    if (!outputItem || typeof outputItem !== 'object') {
      continue
    }
    if (Reflect.get(outputItem, 'type') !== 'function_call') {
      continue
    }
    const name = Reflect.get(outputItem, 'name')
    if (typeof name !== 'string' || !name) {
      continue
    }
    const callId = Reflect.get(outputItem, 'call_id')
    const rawArguments = Reflect.get(outputItem, 'arguments')
    toolCalls.push({
      arguments: typeof rawArguments === 'string' ? rawArguments : '',
      ...(typeof callId === 'string' && callId
        ? {
            id: callId,
          }
        : {}),
      name,
      status: 'success',
    })
  }
  return toolCalls.length === 0 ? undefined : toolCalls
}

const getEventMessageId = (event: ChatViewEvent, fallbackPrefix: string, fallbackIndex: number): string => {
  const eventWithRequestId = event as ChatViewEvent & { readonly requestId?: string; readonly turnId?: string; readonly value?: unknown }
  if (typeof eventWithRequestId.requestId === 'string' && eventWithRequestId.requestId) {
    return eventWithRequestId.requestId
  }
  if (typeof eventWithRequestId.turnId === 'string' && eventWithRequestId.turnId) {
    return eventWithRequestId.turnId
  }
  if (event.type === 'ai-response-success' && event.value && typeof event.value === 'object') {
    const responseId = Reflect.get(event.value, 'id')
    if (typeof responseId === 'string' && responseId) {
      return responseId
    }
  }
  return `${fallbackPrefix}-${fallbackIndex}`
}

export const toFinalMessages = (events: readonly ChatViewEvent[]): readonly ChatMessage[] => {
  const byId = new Map<string, ChatMessage>()
  let order: string[] = []
  let syntheticUserIndex = 0
  let syntheticAssistantIndex = 0
  for (const event of events) {
    if (event.type === 'chat-session-messages-replaced') {
      byId.clear()
      order = []
      for (const message of event.messages) {
        byId.set(message.id, message)
        order.push(message.id)
      }
      continue
    }
    if (event.type === 'chat-message-added') {
      byId.set(event.message.id, event.message)
      order.push(event.message.id)
      continue
    }
    if (event.type === 'chat-message-updated') {
      const message = byId.get(event.messageId)
      if (!message) {
        continue
      }
      byId.set(event.messageId, {
        ...message,
        ...(event.inProgress === undefined
          ? {}
          : {
              inProgress: event.inProgress,
            }),
        text: event.text,
        time: event.time,
        ...(event.toolCalls === undefined
          ? {}
          : {
              toolCalls: event.toolCalls,
            }),
      })
      continue
    }
    if (event.type === 'handle-submit') {
      const id = getEventMessageId(event, 'user-message', syntheticUserIndex)
      syntheticUserIndex += 1
      const message: ChatMessage = {
        id,
        role: 'user',
        text: event.value,
        time: event.timestamp,
      }
      byId.set(id, message)
      order.push(id)
      continue
    }
    if (event.type === 'ai-response-success') {
      const id = getEventMessageId(event, 'assistant-message', syntheticAssistantIndex)
      syntheticAssistantIndex += 1
      const responseToolCalls = getResponseToolCalls(event.value)
      const message: ChatMessage = {
        id,
        role: 'assistant',
        text: getResponseOutputText(event.value),
        time: event.timestamp,
        ...(event.toolCalls
          ? {
              toolCalls: event.toolCalls,
            }
          : responseToolCalls
            ? {
                toolCalls: responseToolCalls,
              }
            : {}),
      }
      byId.set(id, message)
      order.push(id)
    }
  }
  return order.map((id) => byId.get(id)).filter((message) => !!message) as readonly ChatMessage[]
}
