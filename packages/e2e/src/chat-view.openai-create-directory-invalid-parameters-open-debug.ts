import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-create-directory-valid-uri'

export const skip = 1

export const test: Test = async ({ Chat, ChatDebug, Command, expect, FileSystem, Locator, SideBar, Workspace }) => {
  await SideBar.hide()
  const tmpDir = await FileSystem.getTmpDir()
  const folderName = 'generated-folder'

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
          uri: folderName,
        },
        name: 'create_directory',
      },
    },
    {
      text: `Some kind of error occurred with creating the folder.`,
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
  await expect(message2).toHaveText(`Some kind of error occurred with creating the folder.`)

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
            text: 'Create the generated-folder directory in the workspace',
            type: 'input_text',
          },
        ],
        role: 'user',
      },
      {
        arguments: '{"uri":"generated-folder"}',
        call_id: 'call_ee15e4f2ef15e685ec15e1cc',
        name: 'create_directory',
        type: 'function_call',
      },
      {
        call_id: 'call_ee15e4f2ef15e685ec15e1cc',
        output: '{"error":"Invalid argument: uri must be an absolute URI."}',
        type: 'function_call_output',
      },
    ],
  })
}
