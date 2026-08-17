import type { ChatModel } from '../../ChatModel/ChatModel.ts'

export const getDefaultModelsBuiltin = (): readonly ChatModel[] => {
  return [
    { id: 'builtin/gpt-5.4', name: 'GPT 5.4', provider: 'builtin', supportsReasoningEffort: true, usageCost: 1 },
    { id: 'builtin/gpt-4.1', name: 'GPT 4.1', provider: 'builtin', supportsImages: true, usageCost: 1 },
  ]
}
