import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.backend-request-failed'

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
  await Command.execute('Chat.mockBackendSetRequestFailedResponse', 'Failed to fetch', 'network_error')
  await Chat.handleInput('hello from backend request failed e2e')

  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(1)).toHaveText(
    'Backend completion request failed (network_error). Failed to fetch. Please check that the backend is running, reachable from the browser, and allows this origin.',
  )
}
