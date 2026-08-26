import { afterEach, beforeEach, expect, test } from '@jest/globals'
import { ChatViewModelWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { getImplementationPrompt } from '../src/parts/GetImplementationPrompt/GetImplementationPrompt.ts'
import { handleClickImplementPlan } from '../src/parts/HandleClickImplementPlan/HandleClickImplementPlan.ts'
import { registerMockChatMessageParsingRpc } from '../src/parts/TestHelpers/RegisterMockChatMessageParsingRpc.ts'
import { registerMockChatStorageRpc } from '../src/parts/TestHelpers/RegisterMockChatStorageRpc.ts'

let mockChatMessageParsingRpc: ReturnType<typeof registerMockChatMessageParsingRpc>

beforeEach(() => {
  mockChatMessageParsingRpc = registerMockChatMessageParsingRpc()
})

afterEach(() => {
  mockChatMessageParsingRpc[Symbol.dispose]()
})

test('handleClickImplementPlan should switch to agent mode and submit the saved plan', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  const state = {
    ...createDefaultState(),
    agentMode: 'plan' as const,
    selectedSessionId: 'session-1',
    sessions: [
      {
        id: 'session-1',
        messages: [
          {
            id: 'message-user-1',
            role: 'user' as const,
            text: 'make a plan',
            time: '10:00',
          },
          {
            agentMode: 'plan' as const,
            id: 'message-assistant-1',
            role: 'assistant' as const,
            text: '1. Read the relevant files\n2. Update the code\n3. Run tests',
            time: '10:01',
          },
        ],
        status: 'finished' as const,
        title: 'Chat 1',
        workspaceUri: 'file:///workspace',
      },
    ],
    viewMode: 'detail' as const,
  }
  const implementationPrompt = getImplementationPrompt('1. Read the relevant files\n2. Update the code\n3. Run tests')
  const preparedState = {
    ...state,
    agentMode: 'agent' as const,
    composerSelectionEnd: implementationPrompt.length,
    composerSelectionStart: implementationPrompt.length,
    composerValue: implementationPrompt,
    inputSource: 'script' as const,
  }
  using mockSubmitRpc = ChatViewModelWorker.registerMockRpc({
    'ChatModel.handleSubmit': async () => preparedState,
  })

  const result = await handleClickImplementPlan(state)

  expect(result).toEqual(preparedState)
  expect(result.sessions[0].messages).toHaveLength(2)
  expect(mockSubmitRpc.invocations).toEqual([['ChatModel.handleSubmit', preparedState]])
})

test('handleClickImplementPlan should ignore sessions without an executable plan', async () => {
  const state = {
    ...createDefaultState(),
    agentMode: 'plan' as const,
    selectedSessionId: 'session-1',
    sessions: [
      {
        id: 'session-1',
        messages: [
          {
            agentMode: 'plan' as const,
            id: 'message-assistant-1',
            role: 'assistant' as const,
            text: "I can't make a reliable plan.",
            time: '10:01',
            toolCalls: [
              {
                arguments: '{}',
                errorMessage: 'File not found: src/missing.ts',
                name: 'read_file',
                status: 'not-found' as const,
              },
            ],
          },
        ],
        status: 'finished' as const,
        title: 'Chat 1',
      },
    ],
  }

  const result = await handleClickImplementPlan(state)

  expect(result).toBe(state)
})
