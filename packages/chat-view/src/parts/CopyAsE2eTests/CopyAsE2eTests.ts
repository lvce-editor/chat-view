/* eslint-disable unicorn/no-immediate-mutation */
import type { ChatViewEvent } from '../ChatViewEvent/ChatViewEvent.ts'
import { escape } from './Escape/Escape.ts'
import { toFinalMessages } from './ToFinalMessages/ToFinalMessages.ts'

export const copyAsE2eTests = (events: readonly ChatViewEvent[]): string => {
  const messages = toFinalMessages(events).filter((message) => (message.role === 'assistant' ? !message.inProgress : true))
  const lines: string[] = []
  lines.push("import type { Test } from '@lvce-editor/test-with-playwright'")
  lines.push('')
  lines.push("export const name = 'chat-view.generated-e2e'")
  lines.push('')
  lines.push('export const skip = 1')
  lines.push('')
  lines.push('export const test: Test = async ({ Chat, Command, expect, Locator }) => {')
  lines.push('  await Chat.show()')
  lines.push('  await Chat.reset()')
  lines.push('  await Chat.setStreamingEnabled(true)')
  lines.push('  await Chat.useMockApi()')
  lines.push("  await Chat.handleModelChange('openapi/gpt-4.1-mini')")
  lines.push('')
  for (let i = 0; i < messages.length; i += 1) {
    const message = messages[i]
    if (message.role !== 'user') {
      continue
    }
    const assistantMessage = messages[i + 1]
    if (assistantMessage?.role === 'assistant') {
      lines.push("  await Command.execute('Chat.mockOpenApiStreamReset')")
      lines.push(`  await Command.execute('Chat.mockOpenApiStreamPushChunk', ${escape(assistantMessage.text)})`)
      lines.push("  await Command.execute('Chat.mockOpenApiStreamFinish')")
    }
    lines.push(`  await Chat.handleInput(${escape(message.text)})`)
    lines.push('  await Chat.handleSubmit()')
    lines.push('')
  }
  lines.push("  const messages = Locator('.ChatMessages .Message')")
  lines.push(`  await expect(messages).toHaveCount(${messages.length})`)
  for (let i = 0; i < messages.length; i += 1) {
    lines.push(`  await expect(messages.nth(${i})).toContainText(${escape(messages[i].text)})`)
  }
  lines.push('}')
  return lines.join('\n')
}
