import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-invalid-value-error-mock'

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.mockOpenApiSetHttpErrorResponse', 400, {
    error: {
      code: 'invalid_value',
      message: "Invalid value: 'input_text'. Supported values are: 'output_text' and 'refusal'.",
      param: 'input[1].content[0]',
      type: 'invalid_request_error',
    },
  })
  await Chat.handleInput('hello from e2e')

  await Chat.handleSubmit()
  await Chat.rerender()

  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(1)).toContainText('OpenAI request failed (status 400): invalid_value [invalid_request_error].')
  await expect(messages.nth(1)).toContainText("Invalid value: 'input_text'. Supported values are: 'output_text' and 'refusal'.")
}
