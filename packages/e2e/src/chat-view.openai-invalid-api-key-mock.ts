import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-invalid-api-key-mock'

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
  const messages = Locator('.ChatMessages .Message')
  await expect(messages).toHaveCount(2)
  const first = messages.nth(0)
  await expect(first).toHaveText('hello from e2e')
  const secondMessage = messages.nth(1)
  await expect(secondMessage).toHaveText(`OpenAI request failed (status 401): Invalid API key. Please verify your OpenAI API key in Chat settings.`)

  // TODO
  // Expect a Settings button to be present so users can open settings.json
  // const settingsButton = Locator('.ChatMessages .Message [name="open-openapi-api-key-settings"]')
  // await expect(settingsButton).toBeVisible()
}
