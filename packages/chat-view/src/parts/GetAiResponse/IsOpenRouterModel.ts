import type { ChatModel } from '../ChatState/ChatState.ts'

export const isOpenRouterModel = (selectedModelId: string, models: readonly ChatModel[]): boolean => {
  const selectedModel = models.find((model) => model.id === selectedModelId)
  if (selectedModel?.provider === 'openRouter') {
    return true
  }
  return selectedModelId.startsWith('openRouter/')
}
