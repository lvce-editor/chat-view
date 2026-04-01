import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-tool-enablement-setting'

interface MockOpenApiRequest {
  readonly payload: {
    readonly tools?: readonly {
      readonly name?: string
      readonly type: string
    }[]
  }
}

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const skip = 1

export const test: Test = async ({ Chat, Command, expect, Locator }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(true)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.handleInput', 'open-api-api-key', 'sk-e2e-openai-key')
  await Command.execute('Chat.handleClick', 'save-openapi-api-key')

  const messages = Locator('.ChatMessages .Message')

  await Chat.mockOpenApiRequestReset()
  await Chat.mockOpenApiStreamReset()
  await Chat.mockOpenApiStreamPushChunk('ok')
  await Chat.mockOpenApiStreamFinish()
  await Chat.handleInput('first request')
  await Chat.handleSubmit()

  await expect(messages).toHaveCount(2)
  await expect(messages.nth(1)).toHaveText('ok')

  const initialRequests = (await Chat.mockOpenApiRequestGetAll()) as readonly MockOpenApiRequest[]
  const initialTools = initialRequests[0]?.payload.tools || []
  assert(
    initialTools.some((tool) => tool.type === 'function' && tool.name === 'read_file'),
    'read_file should be enabled by default',
  )

  await Command.execute('Chat.setToolEnablement', {
    read_file: false,
  })
  await Chat.mockOpenApiRequestReset()
  await Chat.mockOpenApiStreamReset()
  await Chat.mockOpenApiStreamPushChunk('ok')
  await Chat.mockOpenApiStreamFinish()
  await Chat.handleInput('second request')
  await Chat.handleSubmit()

  await expect(messages).toHaveCount(4)
  await expect(messages.nth(3)).toHaveText('ok')

  const disabledRequests = (await Chat.mockOpenApiRequestGetAll()) as readonly MockOpenApiRequest[]
  const disabledTools = disabledRequests[0]?.payload.tools || []
  assert(!disabledTools.some((tool) => tool.type === 'function' && tool.name === 'read_file'), 'read_file should be removed when disabled')
}
