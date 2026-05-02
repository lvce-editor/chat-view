import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.backend-completion-api-free-plan-model-not-allowed'

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
    code: 'E_LVCE_MODEL_NOT_ALLOWED_FOR_FREE_PLAN',
    error:
      'The Free plan only supports lower-cost LVCE models such as Claude Haiku and GPT-5.4 Mini. The requested model "gpt-4.1-mini" requires a paid plan.',
    statusCode: 402,
  })
  await Chat.handleInput('hello from backend free plan e2e')

  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(1)).toContainText('Backend completion request failed (status 402).')
  await expect(messages.nth(1)).toContainText(
    'The selected model is not available on the Free plan. Choose a lower-cost LVCE model such as Claude Haiku or GPT-5.4 Mini, or upgrade your plan and try again.',
  )
}