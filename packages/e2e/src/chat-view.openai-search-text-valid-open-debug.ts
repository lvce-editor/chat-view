import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-create-directory-valid-uri-open-debug'

export const skip = true

export const test: Test = async ({ Chat, ChatDebug, FileSystem, SideBar, Workspace }) => {
  await SideBar.hide()
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file.txt`, 'abcdef')
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
          options: {
            exclude: [],
            isRegex: false,
            matchCase: false,
            matchWholeWord: false,
            value: 'abc',
          },
          uri: tmpDir,
        },
        name: 'search_text',
      },
    },
    {
      text: `search for abc.`,
    },
  ] as any)

  await Chat.handleInput(`search for abc in the workspace`)
  await Chat.handleSubmit()
  await Chat.openDebugView()
  await ChatDebug.selectEventRow(2)
  await ChatDebug.openTabPayload()
  // @ts-ignore
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
        arguments: '{"options":{"exclude":[],"isRegex":false,"matchCase":false,"matchWholeWord":false,"value":"abc"},"uri":"memfs:///workspace"}',
        call_id: 'call_484e085b474e06c84a4e0b81',
        name: 'search_text',
        type: 'function_call',
      },
      {
        call_id: 'call_484e085b474e06c84a4e0b81',
        output: JSON.stringify({
          results: [{ column: 1, line: 1, text: 'abcdef', uri: 'memfs:///workspace/file.txt' }],
        }),
        type: 'function_call_output',
      },
    ],
  })
}
