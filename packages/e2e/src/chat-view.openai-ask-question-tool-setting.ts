import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat-view.openai-ask-question-tool-setting'

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

export const test: Test = async ({ Chat, Command }) => {
  await Chat.show()
  await Chat.reset()
  await Chat.setStreamingEnabled(true)
  await Chat.useMockApi()
  await Chat.handleModelChange('openapi/gpt-4.1-mini')
  await Command.execute('Chat.handleInput', 'open-api-api-key', 'sk-e2e-openai-key')
  await Command.execute('Chat.handleClick', 'save-openapi-api-key')

  await Command.execute('Chat.mockOpenApiRequestReset')
  await Command.execute('Chat.mockOpenApiStreamReset')
  await Command.execute('Chat.mockOpenApiStreamPushChunk', 'ok')
  await Command.execute('Chat.mockOpenApiStreamFinish')
  await Chat.handleInput('first request')
  await Chat.handleSubmit()

  const initialRequests = (await Command.execute('Chat.mockOpenApiRequestGetAll')) as readonly MockOpenApiRequest[]
  const initialTools = initialRequests[0]?.payload.tools || []
  assert(
    !initialTools.some((tool) => tool.type === 'function' && tool.name === 'ask_question'),
    'ask_question should be disabled by default',
  )

  await Command.execute('Chat.setQuestionToolEnabled', true)
  await Command.execute('Chat.mockOpenApiRequestReset')
  await Command.execute('Chat.mockOpenApiStreamReset')
  await Command.execute('Chat.mockOpenApiStreamPushChunk', 'ok')
  await Command.execute('Chat.mockOpenApiStreamFinish')
  await Chat.handleInput('second request')
  await Chat.handleSubmit()

  const enabledRequests = (await Command.execute('Chat.mockOpenApiRequestGetAll')) as readonly MockOpenApiRequest[]
  const enabledTools = enabledRequests[0]?.payload.tools || []
  assert(
    enabledTools.some((tool) => tool.type === 'function' && tool.name === 'ask_question'),
    'ask_question should be present when enabled',
  )
}
