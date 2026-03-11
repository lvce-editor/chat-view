import type { ChatState } from '../ChatState/ChatState.ts'
import { createSession } from '../CreateSession/CreateSession.ts'
import { deleteSession } from '../DeleteSession/DeleteSession.ts'
import { handleClickOpenApiApiKeySettings } from '../HandleClickOpenApiApiKeySettings/HandleClickOpenApiApiKeySettings.ts'
import { handleClickOpenApiApiKeyWebsite } from '../HandleClickOpenApiApiKeyWebsite/HandleClickOpenApiApiKeyWebsite.ts'
import { handleClickOpenRouterApiKeySettings } from '../HandleClickOpenRouterApiKeySettings/HandleClickOpenRouterApiKeySettings.ts'
import { handleClickOpenRouterApiKeyWebsite } from '../HandleClickOpenRouterApiKeyWebsite/HandleClickOpenRouterApiKeyWebsite.ts'
import { handleClickSaveOpenApiApiKey } from '../HandleClickSaveOpenApiApiKey/HandleClickSaveOpenApiApiKey.ts'
import { handleClickSaveOpenRouterApiKey } from '../HandleClickSaveOpenRouterApiKey/HandleClickSaveOpenRouterApiKey.ts'
import { handleClickSend } from '../HandleClickSend/HandleClickSend.ts'
import { handleClickCreateProject } from '../HandleClickCreateProject/HandleClickCreateProject.ts'
import * as InputName from '../InputName/InputName.ts'
import { OpenOpenApiApiKeySettings, OpenOpenApiApiKeyWebsite, SaveOpenApiApiKey } from '../OpenApiApiKeyNames/OpenApiApiKeyNames.ts'
import { OpenOpenRouterApiKeySettings, OpenOpenRouterApiKeyWebsite, SaveOpenRouterApiKey } from '../OpenRouterApiKeyNames/OpenRouterApiKeyNames.ts'
import { selectProject } from '../SelectProject/SelectProject.ts'
import { selectSession } from '../SelectSession/SelectSession.ts'
import { startRename } from '../StartRename/StartRename.ts'

export const handleClick = async (state: ChatState, name: string, id = ''): Promise<ChatState> => {
  if (!name) {
    return state
  }
  if (name === InputName.CreateSession) {
    return createSession(state)
  }
  if (name === InputName.CreateProject) {
    return handleClickCreateProject(state)
  }
  if (InputName.isProjectInputName(name)) {
    const projectId = InputName.getProjectIdFromInputName(name)
    return selectProject(state, projectId)
  }
  if (InputName.isSessionInputName(name)) {
    const sessionId = InputName.getSessionIdFromInputName(name)
    return selectSession(state, sessionId)
  }
  if (InputName.isRenameInputName(name)) {
    const sessionId = InputName.getRenameIdFromInputName(name)
    return startRename(state, sessionId)
  }
  if (name === InputName.SessionDelete) {
    return deleteSession(state, id)
  }
  if (name === InputName.Send) {
    return handleClickSend(state)
  }
  if (name === SaveOpenRouterApiKey) {
    return handleClickSaveOpenRouterApiKey(state)
  }
  if (name === SaveOpenApiApiKey) {
    return handleClickSaveOpenApiApiKey(state)
  }
  if (name === OpenOpenRouterApiKeySettings) {
    return handleClickOpenRouterApiKeySettings(state)
  }
  if (name === OpenOpenRouterApiKeyWebsite) {
    return handleClickOpenRouterApiKeyWebsite(state)
  }
  if (name === OpenOpenApiApiKeySettings) {
    return handleClickOpenApiApiKeySettings(state)
  }
  if (name === OpenOpenApiApiKeyWebsite) {
    return handleClickOpenApiApiKeyWebsite(state)
  }
  return state
}

export { handleClickSend } from '../HandleClickSend/HandleClickSend.ts'

export { handleClickList } from '../HandleClickList/HandleClickList.ts'
