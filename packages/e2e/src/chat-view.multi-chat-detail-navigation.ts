import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.multi-chat-detail-navigation'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(true)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Chat.mockOpenApiStreamReset()

  const chatMessages = Locator('.ChatMessages .Message')
  const backButton = Locator('.ChatHeader .IconButton[name="back"]')
  const chatListItems = Locator('.ChatList .ChatListItem')

  // Send first message (chat 1), verify detail opens.
  await Chat.mockOpenApiStreamPushChunk('chat-1-ai')
  const firstSubmitPromise = Chat.handleInput('chat-1-user').then(() => Chat.handleSubmit())
  await expect(backButton).toBeVisible()
  await expect(chatMessages).toHaveCount(2)
  await expect(chatMessages.nth(0)).toContainText('chat-1-user')
  await expect(chatMessages.nth(1)).toContainText('chat-1-ai')
  await Chat.mockOpenApiStreamFinish()
  await firstSubmitPromise

  // Go back to list and ensure chat 1 is listed.
  await Chat.handleClickBack()
  await expect(chatListItems).toHaveCount(1)

  // Send second message (chat 2), verify detail opens.
  await Chat.mockOpenApiStreamPushChunk('chat-2-ai')
  const secondSubmitPromise = Chat.handleInput('chat-2-user').then(() => Chat.handleSubmit())
  await expect(backButton).toBeVisible()
  await expect(chatMessages).toHaveCount(2)
  await expect(chatMessages.nth(0)).toContainText('chat-2-user')
  await expect(chatMessages.nth(1)).toContainText('chat-2-ai')
  await Chat.mockOpenApiStreamFinish()
  await secondSubmitPromise

  // Go back and open chat 1 detail. It should still show chat 1 messages.
  await Chat.handleClickBack()
  await expect(chatListItems).toHaveCount(2)
  // @ts-ignore
  const chatOneLabel = Locator('.ChatListItemLabel').filter({ hasText: 'Chat 1' })
  await expect(chatOneLabel).toHaveCount(1)
  const chatOneLabelName = await chatOneLabel.getAttribute('name')
  if (!chatOneLabelName) {
    throw new Error('chat one label is missing name attribute')
  }
  await Command.execute('Chat.handleClick', chatOneLabelName)
  await expect(backButton).toBeVisible()
  await expect(chatMessages).toHaveCount(2)
  await expect(chatMessages.nth(0)).toContainText('chat-1-user')
  await expect(chatMessages.nth(1)).toContainText('chat-1-ai')
}
