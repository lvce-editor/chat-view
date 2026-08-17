import type { ChatModel } from '../ChatModel/ChatModel.ts'
import { getDefaultModelsAnthropic } from './GetDefaultModelsAnthropic/GetDefaultModelsAnthropic.ts'
import { getDefaultModelsBuiltin } from './GetDefaultModelsBuiltin/GetDefaultModelsBuiltin.ts'
import { getDefaultModelsOpenAi } from './GetDefaultModelsOpenAi/GetDefaultModelsOpenAi.ts'
import { getDefaultModelsTest } from './GetDefaultModelsTest/GetDefaultModelsTest.ts'

export { getDefaultModelsAnthropic } from './GetDefaultModelsAnthropic/GetDefaultModelsAnthropic.ts'
export { getDefaultModelsBuiltin } from './GetDefaultModelsBuiltin/GetDefaultModelsBuiltin.ts'
export { getDefaultModelsOpenAi } from './GetDefaultModelsOpenAi/GetDefaultModelsOpenAi.ts'
export { getDefaultModelsTest } from './GetDefaultModelsTest/GetDefaultModelsTest.ts'

export interface DefaultModelProviderSettings {
  readonly anthropic: boolean
  readonly builtin: boolean
  readonly openai: boolean
  readonly test: boolean
}

export const defaultModelProviderSettings: DefaultModelProviderSettings = {
  anthropic: false,
  builtin: true,
  openai: false,
  test: true,
}

export const getDefaultModels = (settings: DefaultModelProviderSettings = defaultModelProviderSettings): readonly ChatModel[] => {
  return [
    ...(settings.builtin ? getDefaultModelsBuiltin() : []),
    ...(settings.openai ? getDefaultModelsOpenAi() : []),
    ...(settings.anthropic ? getDefaultModelsAnthropic() : []),
    ...(settings.test ? getDefaultModelsTest() : []),
  ]
}
