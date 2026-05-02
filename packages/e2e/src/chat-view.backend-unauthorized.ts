import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.backend-unauthorized'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.setBackendUrl', 'https://backend.example.com')
  await Command.execute('Chat.setUseOwnBackend', true)
  await Chat.mockBackendAuthResponse({
    accessToken: 'backend-token',
    request: 'refresh',
    type: 'success',
    userName: 'Test',
  })
  await Command.execute('Chat.mockBackendSetHttpErrorResponse', 401, {
    code: 'E_ACCESS_DENIED',
    error: 'Access denied. Please log in again and retry.',
    statusCode: 401,
  })
  await Chat.handleInput('hello from backend unauthorized e2e')

  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(1)).toHaveText(
    'Backend completion request failed (status 401: E_ACCESS_DENIED). Access denied. Please log in again and retry.',
  )
}