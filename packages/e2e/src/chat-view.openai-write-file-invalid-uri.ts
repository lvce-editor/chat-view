import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-write-file-invalid-uri'

export const skip = 1

export const test: Test = async ({ Chat, expect, FileSystem, Locator, SideBar, Workspace }) => {
  await SideBar.hide()
  const tmpDir = await FileSystem.getTmpDir()
  const fileName = 'generated-file'

  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Chat.mockOpenApiRequestReset()
  await Chat.mockOpenApiSetResponse([
    {
      toolCall: {
        arguments: {
          content: 'test',
          uri: fileName,
        },
        name: 'write_file',
      },
    },
    {
      text: `Some kind of error occurred.`,
    },
  ])

  await Chat.handleInput(`Create the ${fileName} directory in the workspace`)
  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages .Message')
  const message1 = messages.nth(2)
  await expect(message1).toHaveText(`Some kind of error occurred.`)
  const chatToolData = Locator('.ChatOrderedListItemContent')
  await expect(chatToolData).toHaveText('write_file generated-file (error: {"error":"Invalid argument: uri must be an absolute URI."})')
}
