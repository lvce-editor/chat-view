import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-write-file-valid-uri-open-debug-filter-by-tools'

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
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
  await Chat.openDebugView()
  const rows = Locator('.TableBody .TableRow')
  await expect(rows).toHaveCount(3)
  const second = rows.nth(1)
  await expect(second).toBeVisible()
  // TODO verify size column has expected value
}
