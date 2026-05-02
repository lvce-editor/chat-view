import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.backend-out-of-credits'

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
  await Command.execute('Chat.mockBackendSetHttpErrorResponse', 402, {
    code: 'E_LVCE_USAGE_EXCEEDED',
    error:
      'Monthly virtual token allowance exceeded for your Pro plan. Your plan includes 10,000 virtual tokens per month, and you have used 10,000 this month.',
    statusCode: 402,
  })
  await Chat.handleInput('hello from backend out of credits e2e')

  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(1)).toHaveText(
    'Backend completion request failed (status 402: E_LVCE_USAGE_EXCEEDED). Monthly virtual token allowance exceeded for your Pro plan. Your plan includes 10,000 virtual tokens per month, and you have used 10,000 this month.',
  )
}
