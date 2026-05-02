import type { ChatModel } from '../ChatModel/ChatModel.ts'
import { getDefaultModelsBackend } from './GetDefaultModelsBackend/GetDefaultModelsBackend.ts'
import { getDefaultModelsOpenAi } from './GetDefaultModelsOpenAi/GetDefaultModelsOpenAi.ts'
import { getDefaultModelsOpenRouter } from './GetDefaultModelsOpenRouter/GetDefaultModelsOpenRouter.ts'
import { getDefaultModelsTest } from './GetDefaultModelsTest/GetDefaultModelsTest.ts'

export { getDefaultModelsBackend } from './GetDefaultModelsBackend/GetDefaultModelsBackend.ts'
export { getDefaultModelsOpenAi } from './GetDefaultModelsOpenAi/GetDefaultModelsOpenAi.ts'
export { getDefaultModelsOpenRouter } from './GetDefaultModelsOpenRouter/GetDefaultModelsOpenRouter.ts'
export { getDefaultModelsTest } from './GetDefaultModelsTest/GetDefaultModelsTest.ts'

export const getDefaultModelsSync = (): readonly ChatModel[] => {
  return [...getDefaultModelsTest(), ...getDefaultModelsBackend(), ...getDefaultModelsOpenAi(), ...getDefaultModelsOpenRouter()]
}

export const getDefaultModels = async (): Promise<readonly ChatModel[]> => {
  return getDefaultModelsSync()
}
