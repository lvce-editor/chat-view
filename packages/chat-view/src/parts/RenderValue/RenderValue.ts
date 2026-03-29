import { ViewletCommand } from '@lvce-editor/constants'
import type { ChatState } from '../ChatState/ChatState.ts'
import * as InputName from '../InputName/InputName.ts'
import { OpenApiApiKeyInput } from '../OpenApiApiKeyNames/OpenApiApiKeyNames.ts'
import { OpenRouterApiKeyInput } from '../OpenRouterApiKeyNames/OpenRouterApiKeyNames.ts'

export const renderValue = (oldState: ChatState, newState: ChatState): readonly [string, number, string, string] => {
  const { composerValue, openApiApiKeyInput, openRouterApiKeyInput, uid } = newState
  if (oldState.openApiApiKeyInput !== openApiApiKeyInput) {
    return [ViewletCommand.SetValueByName, uid, OpenApiApiKeyInput, openApiApiKeyInput]
  }
  if (oldState.openRouterApiKeyInput !== openRouterApiKeyInput) {
    return [ViewletCommand.SetValueByName, uid, OpenRouterApiKeyInput, openRouterApiKeyInput]
  }
  return [ViewletCommand.SetValueByName, uid, InputName.Composer, composerValue]
}
