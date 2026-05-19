import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-create-directory-valid-uri'

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
  const workspaceUri = `file://${tmpDir}`
  const folderName = 'generated-folder'
  const folderUri = `${workspaceUri}/${folderName}`

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
  await expect(messages).toHaveCount(2)
  const message0 = messages.nth(0)
  await expect(message0).toHaveText(`Create the ${folderName} directory in the workspace`)
  const message1 = messages.nth(1)
  await expect(message1).toContainText(`create_directory ${folderName}`)
  await expect(message1).not.toContainText('(error:')
  await expect(message1).toContainText(`Created ${folderName}.`)

  const toolCalls = message1.locator('.ChatOrderedListItem')
  await expect(toolCalls).toHaveCount(1)

  const entries = await FileSystem.readDir(tmpDir)
  const folderEntry = entries.find((entry) => entry.name === folderName)
  assert(folderEntry, `Expected ${folderName} to be created in ${tmpDir}`)
  await FileSystem.readDir(`${tmpDir}/${folderName}`)

  const requests = (await Chat.mockOpenApiRequestGetAll()) as readonly MockOpenApiRequest[]
  assertEqual(requests.length, 2, 'OpenAI request count')

  const secondPayload = requests[1].payload as {
    readonly input: readonly {
      readonly call_id: string
      readonly output: string
      readonly type: string
    }[]
    readonly previous_response_id: string
  }

  assert(secondPayload.previous_response_id, 'Expected second request previous_response_id to be set')
  assertEqual(secondPayload.input.length, 1, 'second request input length')
  assertEqual(secondPayload.input[0].type, 'function_call_output', 'second request first input type')
  assert(secondPayload.input[0].call_id, 'Expected second request first call id to be set')
  assert(
    secondPayload.input[0].output.includes('"name":"create_directory"'),
    'Expected second request output to include create_directory tool result',
  )
  assert(secondPayload.input[0].output.includes(folderUri), 'Expected second request output to include created folder URI')
}
