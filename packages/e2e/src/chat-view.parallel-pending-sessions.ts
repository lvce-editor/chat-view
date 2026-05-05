import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.parallel-pending-sessions'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  let step = 'initialize test'
  const firstRequestId = 'request-1'
  const secondRequestId = 'request-2'
  try {
    step = 'show and configure chat'
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

    step = 'reset first pending request stream'
    await Command.execute('Chat.mockOpenApiStreamReset', firstRequestId)
    step = 'type first user message'
    await Chat.handleInput('chat-1-user')
    step = 'submit first user message'
    const firstSubmitPromise = Chat.handleSubmit()
    step = 'start first pending request stream'
    await Command.execute('Chat.mockOpenApiStreamPushChunk', firstRequestId, 'c')

    step = 'return to list after first request'
    await Chat.handleClickBack()
    await expect(chatListItems).toHaveCount(1)
    await expect(chatListLabels.nth(0)).toHaveText('Chat 1')

    step = 'open second draft chat'
    await Chat.handleClickNew()
    step = 'reset second pending request stream'
    await Command.execute('Chat.mockOpenApiStreamReset', secondRequestId)
    step = 'type second user message'
    await Chat.handleInput('chat-2-user')
    step = 'submit second user message'
    const secondSubmitPromise = Chat.handleSubmit()
    step = 'start second pending request stream'
    await Command.execute('Chat.mockOpenApiStreamPushChunk', secondRequestId, 'c')

    step = 'return to list after second request'
    await Chat.handleClickBack()
    await expect(chatListItems).toHaveCount(2)
    await expect(chatListLabels.nth(0)).toHaveText('Chat 1')
    await expect(chatListLabels.nth(1)).toHaveText('Chat 2')

    step = 'open first chat and finish first request'
    await chatListItems.nth(0).click()
    await expect(backButton).toBeVisible()
    await expect(chatMessages.nth(0)).toContainText('chat-1-user')
    await Command.execute('Chat.mockOpenApiStreamPushChunk', firstRequestId, 'hat-1-ai')
    await Command.execute('Chat.mockOpenApiStreamFinish', firstRequestId)
    await firstSubmitPromise
    await expect(chatMessages).toHaveCount(2)
    await expect(chatMessages.nth(1)).toContainText('chat-1-ai')

    step = 'open second chat and finish second request'
    await Chat.handleClickBack()
    await chatListItems.nth(1).click()
    await expect(backButton).toBeVisible()
    await expect(chatMessages.nth(0)).toContainText('chat-2-user')
    await Command.execute('Chat.mockOpenApiStreamPushChunk', secondRequestId, 'hat-2-ai')
    await Command.execute('Chat.mockOpenApiStreamFinish', secondRequestId)
    await secondSubmitPromise
    await expect(chatMessages).toHaveCount(2)
    await expect(chatMessages.nth(1)).toContainText('chat-2-ai')
  } catch (error) {
    throw new Error(`step failed: ${step}: ${error}`)
  }
}
