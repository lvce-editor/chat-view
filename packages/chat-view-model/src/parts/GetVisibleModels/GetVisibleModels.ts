import type { ChatModel } from '../ViewModel/ViewModel.ts'

const getModelLabel = (model: ChatModel): string => {
  if (model.provider === 'openRouter') {
    return `${model.name} (OpenRouter)`
  }
  if (model.provider === 'openApi' || model.provider === 'openAI' || model.provider === 'openai') {
    return `${model.name} (OpenAI)`
  }
  return model.name
}

export const getVisibleModels = (models: readonly ChatModel[], modelPickerSearchValue: string): readonly ChatModel[] => {
  const normalizedSearch = modelPickerSearchValue.trim().toLowerCase()
  if (!normalizedSearch) {
    return models
  }
  return models.filter((model) => getModelLabel(model).toLowerCase().includes(normalizedSearch))
}