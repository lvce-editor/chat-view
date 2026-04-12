import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.plan-mode-request-payload'

interface MockOpenApiRequest {
  readonly payload: {
    readonly instructions?: string
    readonly tools?: readonly { readonly name?: string; readonly type: string }[]
  }
}

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Chat, Command }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(true)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.handleAgentModeChange', 'plan')
  await Chat.mockOpenApiRequestReset()
  await Chat.mockOpenApiStreamReset()
  await Chat.mockOpenApiStreamPushChunk('1. Inspect\n2. Change\n3. Verify')
  await Chat.mockOpenApiStreamFinish()
  await Chat.handleInput('make a plan for the project list')
  await Chat.handleSubmit()

  const requests = (await Chat.mockOpenApiRequestGetAll()) as readonly MockOpenApiRequest[]
  const [{ payload }] = requests

  assert((payload.instructions || '').includes('Plan mode instructions:'), 'Plan mode instructions should be present in the request payload')
  assert(!(payload.tools || []).some((tool) => tool.type === 'web_search'), 'Plan mode should not include web_search')
  assert(!(payload.tools || []).some((tool) => tool.name === 'write_file'), 'Plan mode should not include write_file')
}
