/* eslint-disable @cspell/spellchecker */
import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-message-with-markdown-table'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(true)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.mockOpenApiStreamReset')

  const sseResponseParts = [
    {
      eventId: 121,
      inProgress: false,
      messageId: '0618fa4e-5860-41e5-bf5f-5f43375cd043',
      sessionId: 'ab10c0d9-bf04-4f6e-a31a-7dd7788c49ad',
      text: `Got it! Here's a simple example of a groceries table. You can let me know if you want to customize it with more items, prices, quantities, or categories.

| Item | Quantity | Price (per unit) | Category |
|--------------|----------|------------------|-------------|
| Apples | 4 | $0.50 | Fruits |
| Bread | 1 | $2.00 | Bakery |
| Milk | 2 liters | $1.50 | Dairy |
| Carrots | 1 kg | $1.20 | Vegetables |
| Chicken | 1.5 kg | $5.00 | Meat |

Would you like me to add or change anything?`,
      time: '03:15 PM',
      timestamp: '2026-03-09T14:15:54.246Z',
      type: 'chat-message-updated',
    },
  ]

  for (const responsePart of sseResponseParts) {
    await Command.execute('Chat.mockOpenApiStreamPushChunk', `data: ${JSON.stringify(responsePart)}\n\n`)
  }
  await Command.execute('Chat.mockOpenApiStreamPushChunk', 'data: [DONE]\n\n')
  await Command.execute('Chat.mockOpenApiStreamFinish')

  await Chat.handleInput('whats jsonrpc')
  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages .Message')
  const table = Locator('.ChatMessages .Message .MarkdownTable')
  await expect(messages).toHaveCount(2)
  await expect(table).toHaveCount(1)
  await expect(messages.nth(0)).toHaveText('whats jsonrpc')
}
