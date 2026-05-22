import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-get-workspace-uri-open-debug'

export const skip = 1

export const test: Test = async ({ Chat, ChatDebug, Command, FileSystem, SideBar, Workspace }) => {
  await SideBar.hide()
  await Workspace.setPath('')
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(false)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Chat.mockOpenApiRequestReset()
  await Command.execute('Chat.mockOpenApiSetResponse', [
    {
      toolCall: {
        arguments: {},
        name: 'getWorkspaceUri', // TODO either use snake case or camelCase consistently, currently we have a mix of both in different places which is confusing
      },
    },
    {
      text: `No workspace is open.`,
    },
  ])

  await Chat.handleInput(`No workspace is open.`)
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
            text: 'No workspace is open.',
            type: 'input_text',
          },
        ],
        role: 'user',
      },
      {
        arguments: '{}',
        call_id: 'call_51d382f852d3848b53d3861e',
        name: 'getWorkspaceUri',
        type: 'function_call',
      },
      {
        call_id: 'call_51d382f852d3848b53d3861e',
        output: '{"workspaceUri":""}',
        type: 'function_call_output',
      },
    ],
  })
}
