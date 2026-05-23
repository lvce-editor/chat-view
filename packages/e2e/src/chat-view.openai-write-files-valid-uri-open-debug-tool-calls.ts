import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-write-file-valid-uri-open-debug'

export const skip = 1

export const test: Test = async ({ Chat, ChatDebug, Command, expect, FileSystem, Locator, SideBar, Workspace }) => {
  await SideBar.hide()
  const tmpDir = await FileSystem.getTmpDir()
  const fileName = 'generated-file'
  const file1 = `${tmpDir}/file-1.txt`
  const file2 = `${tmpDir}/file-2.txt`
  const file3 = `${tmpDir}/file-3.txt`

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
          uri: file1,
        },
        name: 'write_file',
      },
    },
    {
      toolCall: {
        arguments: {
          content: 'test',
          uri: file2,
        },
        name: 'write_file',
      },
    },
    {
      toolCall: {
        arguments: {
          content: 'test',
          uri: file3,
        },
        name: 'write_file',
      },
    },
    {
      text: `Created some files.`,
    },
  ])

  await Chat.handleInput(`Create the some files.`)
  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages .Message')
  const message1 = messages.nth(4)
  await expect(message1).toHaveText(`Created some files.`)

  await Chat.openDebugView()
  await ChatDebug.selectEventRow(1)
  await ChatDebug.openTabPayload()

  // @ts-ignore
  await ChatDebug.shouldHavePayload({
    content: 'test',
    uri: 'memfs:///workspace/file-1.txt',
  })
}
