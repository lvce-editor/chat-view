import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-write-file-valid-uri-open-debug-filter-by-network'

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
  await Command.execute('ChatDebug.handleEventCategoryFilter', 'network')
  await expect(rows).toHaveCount(2)
  const row = rows.nth(0)
  const cells = row.locator('.TableCell')
  const cell1 = cells.nth(0)
  await expect(cell1).toHaveText('ai-request')
  const cell2 = cells.nth(1)
  await expect(cell2).toHaveText('POST')
  const cell3 = cells.nth(2)
  await expect(cell3).toHaveText('200')
  const cell4 = cells.nth(3)
  await expect(cell4).toHaveText('0 B')
}
