import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-message-with-markdown-table'

export const test: Test = async ({ Chat, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const mockText = `Got it! Here's a simple example of a groceries table. You can let me know if you want to customize it with more items, prices, quantities, or categories.

| Item | Quantity | Price (per unit) | Category |
|--------------|----------|------------------|-------------|
| Apples | 4 | $0.50 | Fruits |
| Bread | 1 | $2.00 | Bakery |
| Milk | 2 liters | $1.50 | Dairy |
| Carrots | 1 kg | $1.20 | Vegetables |
| Chicken | 1.5 kg | $5.00 | Meat |

Would you like me to add or change anything?`
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Chat.registerMockResponse({ text: mockText })
  await Chat.handleInput('whats jsonrpc')

  // act
  await Chat.handleSubmit()

  // assert
  const messages = Locator('.ChatMessages .Message')
  const table = Locator('.ChatMessages .Message .MarkdownTable')
  await expect(messages).toHaveCount(2)
  await expect(table).toHaveCount(1)
  await expect(messages.nth(0)).toHaveText('whats jsonrpc')
}
