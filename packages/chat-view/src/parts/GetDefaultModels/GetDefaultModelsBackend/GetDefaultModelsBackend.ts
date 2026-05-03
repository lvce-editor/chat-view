import type { ChatModel } from '../../ChatModel/ChatModel.ts'

export const getDefaultModelsBackend = (): readonly ChatModel[] => {
  return [{ id: 'backend/claude-haiku-4.5', name: 'Claude Haiku 4.5', provider: 'backend', usageCost: 0.33 }]
}
