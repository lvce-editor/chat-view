import type { ChatModel } from '../ChatModel/ChatModel.ts'
import { getDefaultModelsOpenAi } from './GetDefaultModelsOpenAi/GetDefaultModelsOpenAi.ts'
import { getDefaultModelsOpenRouter } from './GetDefaultModelsOpenRouter/GetDefaultModelsOpenRouter.ts'
import { getDefaultModelsTest } from './GetDefaultModelsTest/GetDefaultModelsTest.ts'

export { getDefaultModelsOpenAi } from './GetDefaultModelsOpenAi/GetDefaultModelsOpenAi.ts'
export { getDefaultModelsOpenRouter } from './GetDefaultModelsOpenRouter/GetDefaultModelsOpenRouter.ts'
export { getDefaultModelsTest } from './GetDefaultModelsTest/GetDefaultModelsTest.ts'

export const getDefaultModels = (): readonly ChatModel[] => {
  return [...getDefaultModelsTest(), ...getDefaultModelsOpenAi(), ...getDefaultModelsOpenRouter()]
}
