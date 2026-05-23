import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-write-file-valid-uri-open-debug-filter-by-tools'

const assert = (condition: unknown, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const skip = 1

export const test: Test = async ({ Locator, expect, ChatDebug, Chat, Command, FileSystem, Workspace }) => {
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
  await Command.execute('ChatDebug.handleEventCategoryFilter', 'tools')
  await expect(rows).toHaveCount(1)
  const row = rows.nth(0)
  await expect(row).toHaveText(`tool-request-responsePOST200`)
}
