import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-create-directory-valid-uri'

const assert = (condition: unknown, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

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

  const messages = Locator('.ChatMessages .Message')
  const message1 = messages.nth(2)
  await expect(message1).toHaveText(`Created ${fileName}.`)

  const entries = await FileSystem.readFile(`${tmpDir}/${fileName}`)
  assert(entries, `Expected ${fileName} to be created in ${tmpDir}`)
}
