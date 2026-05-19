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

export const test: Test = async ({ Chat, ChatDebug, Command, expect, FileSystem, Locator, SideBar, Workspace }) => {
  await SideBar.hide()
  const tmpDir = await FileSystem.getTmpDir()
  const folderName = 'generated-folder'
  const folderUri = `${tmpDir}/${folderName}`
  await FileSystem.writeFile(`${tmpDir}/file.txt`, 'abcdef')
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
          exclude: [],
          isRegex: false,
          matchCase: false,
          matchWholeWord: false,
          uri: tmpDir,
          value: 'abc',
        },
        name: 'search_text',
      },
    },
    {
      text: `search for abc.`,
    },
  ])

  await Chat.handleInput(`search for abc in the workspace`)
  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages .Message')
  // await expect(messages).toHaveCount(2)
  // const message0 = messages.nth(0)
  // await expect(message0).toHaveText(`search for abc.`)
  const message1 = messages.nth(2)

  // const entries = await FileSystem.readDir(tmpDir)
  // const folderEntry = entries.find((entry) => entry.name === folderName)
  // assert(folderEntry, `Expected ${folderName} to be created in ${tmpDir}`)
  // await FileSystem.readDir(`${tmpDir}/${folderName}`)
  await Chat.openDebugView()
  await ChatDebug.selectEventRow(2)
  await ChatDebug.openTabPayload()
  await ChatDebug.shouldHavePayload({
    input: [
      {
        content:
          'You are an AI programming assistant running inside a code editor.\n\nUse available project context to provide accurate, practical coding help.\n\nPrefer using available tools to inspect and modify files in the current workspace.\nWhen asked to create or update code, read relevant files first and apply changes directly in files instead of only pasting raw code in chat.\nOnly provide raw code snippets when explicitly requested or when file editing tools are unavailable.\nWhen mentioning inline commands, file names, identifiers, or short code fragments in responses, wrap them in markdown backticks, for example `nvm install 24.14.1`.\nWhen displaying code blocks in responses, use markdown triple backticks (```) fences.\nWhen referencing workspace files in responses (including "files added/changed" lists), use markdown links so users can click them.\nPrefer file links like [src/index.ts]({{workspaceUri}}/src/index.ts) and avoid plain text file paths when a link is appropriate.\n\nEnvironment:\n- Editor: LVCE Chat View\n- Current workspace URI: {{workspaceUri}}',
        role: 'system',
      },
      {
        content: [
          {
            text: 'search for abc in the workspace',
            type: 'input_text',
          },
        ],
        role: 'user',
      },
      {
        arguments: '{"exclude":[],"isRegex":false,"matchCase":false,"matchWholeWord":false,"uri":"memfs:///workspace","value":"abc"}',
        call_id: 'call_f313de01f213dc6ef113dadb',
        name: 'search_text',
        type: 'function_call',
      },
      {
        call_id: 'call_f313de01f213dc6ef113dadb',
        output:
          '{"error":"Invalid argument: options must include value (string), isRegex (boolean), matchCase (boolean), machWholeWord (boolean), and exclude (string[])."}',
        type: 'function_call_output',
      },
    ],
  })
}
