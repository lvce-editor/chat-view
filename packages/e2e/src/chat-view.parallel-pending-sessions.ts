import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.parallel-pending-sessions'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  const firstRequestId = 'request-1'
  const secondRequestId = 'request-2'

  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(true)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')

  const backButton = Locator('.ChatHeader .IconButton[name="back"]')
  const stopButton = Locator('.IconButton[name="stop"]')
  const chatMessages = Locator('.ChatDetailsContent .Message')
  const chatListItems = Locator('.ChatList .ChatListItem')
  // @ts-ignore
  const chatOneLabel = Locator('.ChatListItemLabel').filter({ hasText: 'Chat 1' })
  // @ts-ignore
  const chatTwoLabel = Locator('.ChatListItemLabel').filter({ hasText: 'Chat 2' })

  await Command.execute('Chat.mockOpenApiStreamReset', firstRequestId)
  await Chat.handleInput('chat-1-user')
  const firstSubmitPromise = Chat.handleSubmit()

  await expect(backButton).toBeVisible()
  await expect(stopButton).toBeVisible()
  await expect(chatMessages).toHaveCount(1)
  await expect(chatMessages.nth(0)).toContainText('chat-1-user')

  await Chat.handleClickBack()
  await expect(chatListItems).toHaveCount(1)
  await expect(chatOneLabel).toHaveCount(1)

  await Command.execute('Chat.mockOpenApiStreamReset', secondRequestId)
  await Chat.handleInput('chat-2-user')
  const secondSubmitPromise = Chat.handleSubmit()

  await expect(backButton).toBeVisible()
  await expect(stopButton).toBeVisible()
  await expect(chatMessages).toHaveCount(1)
  await expect(chatMessages.nth(0)).toContainText('chat-2-user')

  await Chat.handleClickBack()
  await expect(chatListItems).toHaveCount(2)
  await expect(chatTwoLabel).toHaveCount(1)

  await chatOneLabel.click()
  await expect(backButton).toBeVisible()
  await expect(chatMessages).toHaveCount(1)
  await expect(chatMessages.nth(0)).toContainText('chat-1-user')

  await Command.execute('Chat.mockOpenApiStreamPushChunk', firstRequestId, 'chat-1-ai')
  await Command.execute('Chat.mockOpenApiStreamFinish', firstRequestId)
  await firstSubmitPromise

  await expect(chatMessages).toHaveCount(2)
  await expect(chatMessages.nth(1)).toContainText('chat-1-ai')

  await Chat.handleClickBack()
  await chatTwoLabel.click()
  await expect(backButton).toBeVisible()
  await expect(chatMessages).toHaveCount(1)
  await expect(chatMessages.nth(0)).toContainText('chat-2-user')

  await Command.execute('Chat.mockOpenApiStreamPushChunk', secondRequestId, 'chat-2-ai')
  await Command.execute('Chat.mockOpenApiStreamFinish', secondRequestId)
  await secondSubmitPromise

  await expect(chatMessages).toHaveCount(2)
  await expect(chatMessages.nth(1)).toContainText('chat-2-ai')
}
