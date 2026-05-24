import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-read-file-error-is-folder-open-debug'

export const skip = 1

export const test: Test = async ({ Chat, ChatDebug, expect, FileSystem, Locator, SideBar, Workspace }) => {
  await SideBar.hide()
  const tmpDir = await FileSystem.getTmpDir()
  // const fileName = 'generated-file'

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
          uri: tmpDir,
        },
        name: 'read_file',
      },
    },
    {
      text: `Some kind of error.`,
    },
  ] as any)

  await Chat.handleInput(`Read the ${tmpDir} file in the workspace`)
  await Chat.handleSubmit()
  const messages = Locator('.ChatMessages .Message')
  const message1 = messages.nth(2)
  await expect(message1).toHaveText(`Some kind of error.`)

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
            text: `Read the memfs:///workspace file in the workspace`,
            type: 'input_text',
          },
        ],
        role: 'user',
      },
      {
        arguments: '{"content":"test","uri":"memfs:///workspace/generated-file"}',
        call_id: 'call_87de6ce986de6b5685de69c3',
        name: 'read_file',
        type: 'function_call',
      },
      {
        call_id: 'call_433f7188443f731b453f74ae',
        output: '{"addedLines":1,"ok":true,"removedLines":0,"uri":"memfs:///workspace/generated-file"}',
        type: 'function_call_output',
      },
    ],
  })
}
