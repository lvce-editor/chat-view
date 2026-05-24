import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-write-file-valid-uri-open-debug-tool-call'

export const skip = 1

export const test: Test = async ({ Chat, ChatDebug, expect, FileSystem, Locator, SideBar, Workspace }) => {
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
  // @ts-ignore
  await Chat.mockOpenApiSetResponse([
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
  await ChatDebug.selectEventRow(1)
  await ChatDebug.openTabResponse()

  // TODO should we show callId and status here?
  // @ts-ignore
  await ChatDebug.shouldHaveResponse({
    value: {
      addedLines: 1,
      ok: true,
      removedLines: 0,
      uri: 'memfs:///workspace/generated-file',
    },
  })
}
