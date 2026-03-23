import type { ChatModel } from '../ChatModel/ChatModel.ts'
import { getModelLabel } from '../GetModelLabel/GetModelLabel.ts'

export const getVisibleModels = (models: readonly ChatModel[], modelPickerSearchValue: string): readonly ChatModel[] => {
  const normalizedSearch = modelPickerSearchValue.trim().toLowerCase()
  if (!normalizedSearch) {
    return models
  }
  return models.filter((model) => getModelLabel(model).toLowerCase().includes(normalizedSearch))
}
