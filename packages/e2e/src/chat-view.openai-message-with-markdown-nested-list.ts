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
      text: `Here are numbered lists of good foods divided into categories:\n\n1. Fruits:\n   1. Apples\n   2. Bananas\n   3. Blueberries\n   4. Oranges\n   5. Strawberries\n\n2. Vegetables:\n   1. Spinach\n   2. Broccoli\n   3. Carrots\n   4. Kale\n   5. Bell peppers\n\n3. Proteins:\n   1. Chicken breast\n   2. Salmon\n   3. Eggs\n   4. Lentils\n   5. Tofu\n\n4. Whole Grains:\n   1. Quinoa\n   2. Brown rice\n   3. Oats\n   4. Barley\n   5. Whole wheat bread\n\n5. Healthy Fats:\n   1. Avocados\n   2. Almonds\n   3. Olive oil\n   4. Chia seeds\n   5. Walnuts\n\nWould you like more categories or more items in any list?"`,
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
