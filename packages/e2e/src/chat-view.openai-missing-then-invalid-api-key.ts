import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-missing-then-invalid-api-key'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  // arrange
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.mockOpenApiSetHttpErrorResponse', 401, {
    error: {
      code: 'invalid_api_key',
      message:
        'Incorrect API key provided: bad-sk-p************************************************************************************************************************************************************gBMA. You can find your API key at https://platform.openai.com/account/api-keys.',
      param: null,
      type: 'invalid_request_error',
    },
  })
  await Chat.handleInput('hello from e2e')

  // act + assert missing key dom
  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(0)).toHaveText('hello from e2e')
  await expect(messages.nth(1)).toHaveText('OpenAI API key is not configured')
  const openApiApiKeyInput = Locator('[name="open-api-api-key"]')
  await expect(openApiApiKeyInput).toBeVisible()
  await expect(saveButton).toBeVisible()

  // act + assert invalid key message after save/retry
  await Command.execute('Chat.handleInput', 'open-api-api-key', 'sk-invalid-key-for-e2e')

  const saveButton = Locator('[name="save-openapi-api-key"]')
  const clickPromise = Command.execute('Chat.handleClick', 'save-openapi-api-key')
  await expect(saveButton).toHaveAttribute('disabled', '')
  await expect(saveButton).toHaveText('Saving...')
  await clickPromise

  await expect(messages).toHaveCount(2)
  await expect(messages.nth(1)).toHaveText('OpenAI request failed (Status 401): Invalid API key. Please verify your OpenAI API key in Chat Settings.')
  await expect(openApiApiKeyInput).toHaveCount(0)
}
