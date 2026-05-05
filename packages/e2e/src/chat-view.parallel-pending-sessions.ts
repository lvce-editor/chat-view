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
  await Chat.handleClickNew()

  const backButton = Locator('.ChatHeader .IconButton[name="back"]')
  const chatMessages = Locator('.ChatDetailsContent .Message')
  const chatListItems = Locator('.ChatList .ChatListItem')
  const chatListLabels = Locator('.ChatListItemLabel')

  await Command.execute('Chat.mockOpenApiStreamReset', firstRequestId)
  await Chat.handleInput('chat-1-user')
  const firstSubmitPromise = Chat.handleSubmit()

  await Chat.handleClickBack()
  const stateAfterFirstBack = (await Command.execute('Chat.saveState')) as { readonly sessions?: readonly unknown[] }
  await expect(stateAfterFirstBack.sessions?.length || 0).toBe(1)
  await expect(chatListItems).toHaveCount(1)
  await expect(chatListLabels.nth(0)).toHaveText('Chat 1')

  await Chat.handleClickNew()
  await Command.execute('Chat.mockOpenApiStreamReset', secondRequestId)
  await Chat.handleInput('chat-2-user')
  const secondSubmitPromise = Chat.handleSubmit()

  await Chat.handleClickBack()
  await expect(chatListItems).toHaveCount(2)
  await expect(chatListLabels.nth(0)).toHaveText('Chat 1')
  await expect(chatListLabels.nth(1)).toHaveText('Chat 2')

  await chatListItems.nth(0).click()
  await expect(backButton).toBeVisible()
  await expect(chatMessages.nth(0)).toContainText('chat-1-user')
  await Command.execute('Chat.mockOpenApiStreamPushChunk', firstRequestId, 'chat-1-ai')
  await Command.execute('Chat.mockOpenApiStreamFinish', firstRequestId)
  await firstSubmitPromise
  await expect(chatMessages).toHaveCount(2)
  await expect(chatMessages.nth(1)).toContainText('chat-1-ai')

  await Chat.handleClickBack()
  await chatListItems.nth(1).click()
  await expect(backButton).toBeVisible()
  await expect(chatMessages.nth(0)).toContainText('chat-2-user')
  await Command.execute('Chat.mockOpenApiStreamPushChunk', secondRequestId, 'chat-2-ai')
  await Command.execute('Chat.mockOpenApiStreamFinish', secondRequestId)
  await secondSubmitPromise
  await expect(chatMessages).toHaveCount(2)
  await expect(chatMessages.nth(1)).toContainText('chat-2-ai')
}
