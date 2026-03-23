import type { ChatModel } from '../ChatModel/ChatModel.ts'

export const getUsageCostLabel = (model: ChatModel): string => {
  return `${model.usageCost ?? 1}x`
}
