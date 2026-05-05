import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.backend-completion-api-openai-rate-limit-error'

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
  await Command.execute('Chat.mockBackendSetHttpErrorResponse', 429, {
    code: 'openai_api_error',
    error:
      'OpenAI API error (status 429): Rate limit reached for gpt-5.4-mini in organization org-abc on tokens per min (TPM): Limit 200000, Used 177328, Requested 72419. Please try again in 14.924s. Visit https://platform.openai.com/account/rate-limits to learn more.',
    statusCode: 429,
  })
  await Chat.handleInput('hello from backend openai rate limit e2e')

  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(1)).toContainText('Backend completion request failed (status 429).')
  await expect(messages.nth(1)).toContainText('Error code: openai_api_error.')
  await expect(messages.nth(1)).toContainText('OpenAI API error (status 429): Rate limit reached for gpt-5.4-mini')
  await expect(messages.nth(1)).toContainText('Please try again in 14.924s.')
}
