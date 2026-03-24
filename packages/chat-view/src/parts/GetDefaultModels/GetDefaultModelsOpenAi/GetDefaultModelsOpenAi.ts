import type { ChatModel } from '../../ChatModel/ChatModel.ts'

export const getDefaultModelsOpenAi = (): readonly ChatModel[] => {
  return [
    { id: 'openapi/gpt-5-mini', name: 'GPT-5 Mini', provider: 'openApi' },
    { id: 'openapi/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openApi', usageCost: 1 },
    { id: 'openapi/gpt-4o', name: 'GPT-4o', provider: 'openApi', usageCost: 3 },
    { id: 'openapi/gpt-4.1-mini', name: 'GPT-4.1 Mini', provider: 'openApi', usageCost: 1 },
  ]
}
