import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.backend-invalid-response'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Chat.setBackendUrl('https://backend.example.com')
  await Command.execute('Chat.setUseOwnBackend', true)
  await Chat.mockBackendAuthResponse({
    accessToken: 'backend-token',
    request: 'refresh',
    type: 'success',
    userName: 'Simon',
  })
  await Command.execute('Chat.mockBackendSetResponse', {
    id: 'resp_invalid',
    output: [],
    status: 'completed',
  })
  await Chat.handleInput('hello from backend invalid response e2e')

  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(1)).toHaveText(
    'Backend completion request failed. Unexpected backend response format: no assistant text or tool calls were returned.',
  )
}
