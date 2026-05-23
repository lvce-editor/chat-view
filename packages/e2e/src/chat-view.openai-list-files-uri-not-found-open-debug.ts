import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-list-files-valid-uri-open-debug'

export const skip = 1

export const test: Test = async ({ Chat, ChatDebug, Command, expect, FileSystem, Locator, SideBar, Workspace }) => {
  await SideBar.hide()
  const tmpDir = await FileSystem.getTmpDir()
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
          uri: `${tmpDir}/non-existent`,
        },
        name: 'list_files',
      },
    },
    {
      text: `Couldn't find folder.`,
    },
  ])

  await Chat.handleInput(`List the files`)
  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages .Message')
  const message1 = messages.nth(2)
  await expect(message1).toHaveText(`Couldn't find folder.`)

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
            text: 'List the files',
            type: 'input_text',
          },
        ],
        role: 'user',
      },
      {
        arguments: '{"uri":"memfs:///workspace/non-existent"}',
        call_id: 'call_0bbf3cfc0cbf3e8f0dbf4022',
        name: 'list_files',
        type: 'function_call',
      },
      {
        call_id: 'call_0bbf3cfc0cbf3e8f0dbf4022',
        output: '{"entries":[]}',
        type: 'function_call_output',
      },
    ],
  })
}
