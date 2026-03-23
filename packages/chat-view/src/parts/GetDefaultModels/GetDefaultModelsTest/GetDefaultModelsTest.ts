import type { ChatModel } from '../../ChatModel/ChatModel.ts'

export const getDefaultModelsTest = (): readonly ChatModel[] => {
  const defaultModelId = 'test'
  return [{ id: defaultModelId, name: 'test', provider: 'test', usageCost: 0 }]
}
