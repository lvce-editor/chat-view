import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.backend-completion-api-error-code'

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
    userName: 'Test',
  })
  await Command.execute('Chat.mockBackendSetHttpErrorResponse', 503, {
    code: 'lvce_openai_not_configured',
    error: 'Lvce AI Gateway is not configured for OpenAI models on the server. Set OPENAI_API_KEY in .env.',
  })
  await Chat.handleInput('hello from backend 503 error e2e')

  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(1)).toContainText('Backend completion request failed (status 503).')
  await expect(messages.nth(1)).toContainText('Error code: lvce_openai_not_configured.')
  await expect(messages.nth(1)).toContainText('Lvce AI Gateway is not configured for OpenAI models on the server. Set OPENAI_API_KEY in .env.')
}
