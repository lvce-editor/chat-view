import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-create-directory-valid-uri-open-debug'

const assert = (condition: unknown, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const skip = 1

export const test: Test = async ({ Chat, ChatDebug, Command, expect, FileSystem, Locator, SideBar, Workspace }) => {
  await SideBar.hide()
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
  // @ts-ignore
  await Chat.mockOpenApiSetResponse([
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
  const message0 = messages.nth(0)
  await expect(message0).toHaveText(`Create the ${folderName} directory in the workspace`)
  const message1 = messages.nth(1)
  await expect(message1).toContainText(`create_directory ${folderName}`)
  const toolCalls = message1.locator('.ChatOrderedListItem')
  await expect(toolCalls).toHaveCount(1)
  const message2 = messages.nth(2)
  await expect(message2).toHaveText(`Created ${folderName}.`)

  await Chat.openDebugView()
  await ChatDebug.selectEventRow(2)
  await ChatDebug.openTabPayload()
  await Command.execute('ChatDebug.shouldHavePayload', {
    input: [
      {
        content:
          'You are an AI programming assistant running inside a code editor.\n\nUse available project context to provide accurate, practical coding help.\n\nPrefer using available tools to inspect and modify files in the current workspace.\nWhen asked to create or update code, read relevant files first and apply changes directly in files instead of only pasting raw code in chat.\nOnly provide raw code snippets when explicitly requested or when file editing tools are unavailable.\nWhen mentioning inline commands, file names, identifiers, or short code fragments in responses, wrap them in markdown backticks, for example `nvm install 24.14.1`.\nWhen displaying code blocks in responses, use markdown triple backticks (```) fences.\nWhen referencing workspace files in responses (including "files added/changed" lists), use markdown links so users can click them.\nPrefer file links like [src/index.ts]({{workspaceUri}}/src/index.ts) and avoid plain text file paths when a link is appropriate.\n\nEnvironment:\n- Editor: LVCE Chat View\n- Current workspace URI: {{workspaceUri}}',
        role: 'system',
      },
      {
        content: [
          {
            text: 'Create the generated-folder directory in the workspace',
            type: 'input_text',
          },
        ],
        role: 'user',
      },
      {
        arguments: '{"uri":"memfs:///workspace/generated-folder"}',
        call_id: 'call_2c669eff2b669d6c2e66a225',
        name: 'create_directory',
        type: 'function_call',
      },
      {
        call_id: 'call_2c669eff2b669d6c2e66a225',
        output: '{"ok":true}',
        type: 'function_call_output',
      },
    ],
  })

  const entries = await FileSystem.readDir(tmpDir)
  const folderEntry = entries.find((entry) => entry.name === folderName)
  assert(folderEntry, `Expected ${folderName} to be created in ${tmpDir}`)
  await FileSystem.readDir(`${tmpDir}/${folderName}`)
}
