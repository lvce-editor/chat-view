import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.backend-completion-api-error'

export const skip = 1

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
    userName: 'Simon',
  })
  await Command.execute('Chat.mockBackendSetHttpErrorResponse', 403, {
    error: 'Vercel AI Gateway error (status 403): AI Gateway requires a valid credit card on file to service requests.',
    statusCode: 403,
  })
  await Chat.handleInput('hello from backend e2e')

  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(1)).toContainText('Backend completion request failed (status 403).')
  await expect(messages.nth(1)).toContainText(
    'Vercel AI Gateway error (status 403): AI Gateway requires a valid credit card on file to service requests.',
  )
}
