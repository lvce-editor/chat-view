import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-invalid-api-key-mock'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Command.execute('Layout.showSecondarySideBar')
  await Command.execute('Chat.reset')
  await Command.execute('Chat.setStreamingEnabled', false)
  await Command.execute('Chat.useMockApi', true)
  await Command.execute('Chat.handleModelChange', 'openapi/gpt-4.1-mini')
  await Command.execute('Chat.mockOpenApiSetHttpErrorResponse', 401, {
    error: {
      code: 'invalid_api_key',
      message:
        'Incorrect API key provided: bad-sk-p************************************************************************************************************************************************************gBMA. You can find your API key at https://platform.openai.com/account/api-keys.',
      param: null,
      type: 'invalid_request_error',
    },
  })
  await Command.execute('Chat.handleInput', 'composer', 'hello from e2e', 'script')

  // act
  await Command.execute('Chat.handleSubmit')

  // assert
  const messages = Locator('.ChatDetailsContent .Message')
  await expect(messages).toHaveCount(2)
  await expect(messages.nth(1)).toContainText('OpenAI request failed (status 401): invalid_api_key [invalid_request_error].')
  await expect(messages.nth(1)).toContainText('Incorrect API key provided')
  await expect(messages.nth(1)).toContainText('https://platform.openai.com/account/api-keys')
}
