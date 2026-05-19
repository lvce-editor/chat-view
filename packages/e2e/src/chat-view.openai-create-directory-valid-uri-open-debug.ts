import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-create-directory-valid-uri-open-debug'

interface MockOpenApiRequest {
  readonly payload: unknown
}

const assert = (condition: unknown, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

const assertEqual = <T>(actual: T, expected: T, message: string): void => {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${String(expected)}, got ${String(actual)}`)
  }
}

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const folderName = 'generated-folder'
  const folderUri = `${tmpDir}/${folderName}`

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
          uri: folderUri,
        },
        name: 'create_directory',
      },
    },
    {
      text: `Created ${folderName}.`,
    },
  ])

  await Chat.handleInput(`Create the ${folderName} directory in the workspace`)
  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages .Message')
  // await expect(messages).toHaveCount(2)
  const message0 = messages.nth(0)
  await expect(message0).toHaveText(`Create the ${folderName} directory in the workspace`)
  const message1 = messages.nth(1)

  const entries = await FileSystem.readDir(tmpDir)
  const folderEntry = entries.find((entry) => entry.name === folderName)
  assert(folderEntry, `Expected ${folderName} to be created in ${tmpDir}`)
  await FileSystem.readDir(`${tmpDir}/${folderName}`)
}
