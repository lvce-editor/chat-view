import type { ChatModel } from '../ChatModel/ChatModel.ts'

export const getModelLabel = (model: ChatModel): string => {
  if (model.provider === 'builtin') {
    return `${model.name} (Builtin)`
  }
  if (model.provider === 'openRouter') {
    return `${model.name} (OpenRouter)`
  }
  if (model.provider === 'openApi' || model.provider === 'openAI' || model.provider === 'openai') {
    return `${model.name} (OpenAI)`
  }
  return model.name
}
