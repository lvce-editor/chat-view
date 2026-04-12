import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.plan-mode-missing-file-failure'

export const test: Test = async ({ Chat, Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(true)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.handleAgentModeChange', 'plan')
  await Chat.mockOpenApiStreamReset()
  await Chat.mockOpenApiStreamPushChunk(
    `data: ${JSON.stringify({
      response: {
        id: 'resp_01',
        output: [
          {
            arguments: JSON.stringify({ path: 'src/missing.ts' }),
            call_id: 'call_01',
            id: 'fc_01',
            name: 'read_file',
            status: 'completed',
            type: 'function_call',
          },
        ],
        status: 'completed',
      },
      sequence_number: 1,
      type: 'response.completed',
    })}\n\n`,
  )
  await Chat.mockOpenApiStreamPushChunk(
    `data: ${JSON.stringify({ delta: "I can't make a reliable plan because I could not read src/missing.ts.", type: 'response.output_text.delta' })}\n\n`,
  )
  await Chat.mockOpenApiStreamPushChunk(
    `data: ${JSON.stringify({
      response: {
        id: 'resp_02',
        output: [],
        status: 'completed',
      },
      sequence_number: 2,
      type: 'response.completed',
    })}\n\n`,
  )
  await Chat.mockOpenApiStreamPushChunk('data: [DONE]\n\n')
  await Chat.mockOpenApiStreamFinish()
  await Chat.handleInput('make a plan for src/missing.ts')
  await Chat.handleSubmit()

  const messages = Locator('.ChatMessages .Message')
  const implementButton = Locator('.ChatSendAreaBottom .Button[name="implement-plan"]')

  await expect(messages).toHaveCount(2)
  await expect(messages.nth(1)).toContainText("I can't make a reliable plan")
  await expect(messages.nth(1)).toContainText('read_file missing.ts')
  await expect(implementButton).toHaveCount(0)
}
