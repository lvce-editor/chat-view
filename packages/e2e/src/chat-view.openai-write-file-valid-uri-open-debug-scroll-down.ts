import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-write-file-valid-uri-open-debug-tool-call'

export const skip = 1

export const test: Test = async ({ Chat, ChatDebug, Command, expect, FileSystem, Locator, SideBar, Workspace }) => {
  await SideBar.hide()
  const tmpDir = await FileSystem.getTmpDir()
  const fileName = 'generated-file'
  const folderUri = `${tmpDir}/${fileName}`

  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Chat.mockOpenApiRequestReset()
  await Command.execute('Chat.mockOpenApiSetResponse', [
    {
      toolCall: {
        arguments: {
          content: 'test',
          uri: folderUri,
        },
        name: 'write_file',
      },
    },
    {
      text: `Created ${fileName}.`,
    },
  ])

  await Chat.handleInput(`Create the ${fileName} directory in the workspace`)
  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages .Message')
  const message1 = messages.nth(2)
  await expect(message1).toHaveText(`Created ${fileName}.`)

  await Chat.openDebugView()
  await ChatDebug.selectEventRow(2)
  await ChatDebug.openTabResponse()

  const line1 = Locator('.ChatDebugViewEventLineNumber', { hasText: '1' })
  await expect(line1).toBeVisible()
  // @ts-ignore
  const line39 = Locator('.ChatDebugViewEventLineNumber', { hasText: '39' })
  // await expect(line39).toBeHidden()
  // TODO
  // @ts-ignore
  // await ChatDebug.scrollResponseToBottom()
}
