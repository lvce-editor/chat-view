import type { ChatState } from '../ChatState/ChatState.ts'
import { createSession } from '../CreateSession/CreateSession.ts'
import { deleteSession } from '../DeleteSession/DeleteSession.ts'
import { getModelPickerClickIndex } from '../GetModelPickerClickIndex/GetModelPickerClickIndex.ts'
import { getVisibleModels } from '../GetVisibleModels/GetVisibleModels.ts'
import { handleClickCreateProject } from '../HandleClickCreateProject/HandleClickCreateProject.ts'
import { handleClickLogin } from '../HandleClickLogin/HandleClickLogin.ts'
import { handleClickLogout } from '../HandleClickLogout/HandleClickLogout.ts'
import { handleClickOpenApiApiKeySettings } from '../HandleClickOpenApiApiKeySettings/HandleClickOpenApiApiKeySettings.ts'
import { handleClickOpenApiApiKeyWebsite } from '../HandleClickOpenApiApiKeyWebsite/HandleClickOpenApiApiKeyWebsite.ts'
import { handleClickOpenRouterApiKeySettings } from '../HandleClickOpenRouterApiKeySettings/HandleClickOpenRouterApiKeySettings.ts'
import { handleClickOpenRouterApiKeyWebsite } from '../HandleClickOpenRouterApiKeyWebsite/HandleClickOpenRouterApiKeyWebsite.ts'
import { handleClickSaveOpenApiApiKey } from '../HandleClickSaveOpenApiApiKey/HandleClickSaveOpenApiApiKey.ts'
import { handleClickSaveOpenRouterApiKey } from '../HandleClickSaveOpenRouterApiKey/HandleClickSaveOpenRouterApiKey.ts'
import { handleClickSend } from '../HandleClickSend/HandleClickSend.ts'
import * as InputName from '../InputName/InputName.ts'
import { OpenOpenApiApiKeySettings, OpenOpenApiApiKeyWebsite, SaveOpenApiApiKey } from '../OpenApiApiKeyNames/OpenApiApiKeyNames.ts'
import { OpenOpenRouterApiKeySettings, OpenOpenRouterApiKeyWebsite, SaveOpenRouterApiKey } from '../OpenRouterApiKeyNames/OpenRouterApiKeyNames.ts'
import { selectProject } from '../SelectProject/SelectProject.ts'
import { selectSession } from '../SelectSession/SelectSession.ts'
import { startRename } from '../StartRename/StartRename.ts'
import { toggleChatFocusMode } from '../ToggleChatFocusMode/ToggleChatFocusMode.ts'
import { toggleProjectExpanded } from '../ToggleProjectExpanded/ToggleProjectExpanded.ts'

export const handleClick = async (state: ChatState, name: string, id = '', eventX = 0, eventY = 0): Promise<ChatState> => {
  if (!name) {
    return state
  }
  void eventX
  switch (true) {
    case name === InputName.CreateSession:
      return createSession(state)
    case name === InputName.CreateProject:
      return handleClickCreateProject(state)
    case InputName.isCreateSessionInProjectInputName(name): {
      const projectId = InputName.getProjectIdFromCreateSessionInProjectInputName(name)
      return createSession(state, projectId)
    }
    case name === InputName.ToggleChatFocus:
      return toggleChatFocusMode(state)
    case name === InputName.ToggleSearch:
      return {
        ...state,
        searchFieldVisible: !state.searchFieldVisible,
        searchValue: state.searchFieldVisible ? '' : state.searchValue,
      }
    case name === InputName.ModelPickerToggle:
      return {
        ...state,
        modelPickerOpen: !state.modelPickerOpen,
        modelPickerSearchValue: state.modelPickerOpen ? '' : state.modelPickerSearchValue,
      }
    case InputName.isModelPickerItemInputName(name): {
      const modelId = InputName.getModelIdFromModelPickerItemInputName(name)
      return {
        ...state,
        modelPickerOpen: false,
        modelPickerSearchValue: '',
        selectedModelId: modelId,
      }
    }
    case name === InputName.ModelPickerList: {
      const visibleModels = getVisibleModels(state.models, state.modelPickerSearchValue)
      const index = getModelPickerClickIndex(state.y, state.height, eventY)
      if (index < 0 || index >= visibleModels.length) {
        return state
      }
      return {
        ...state,
        modelPickerOpen: false,
        modelPickerSearchValue: '',
        selectedModelId: visibleModels[index].id,
      }
    }
    case InputName.isProjectInputName(name): {
      const projectId = InputName.getProjectIdFromInputName(name)
      if (state.viewMode === 'chat-focus') {
        return toggleProjectExpanded(state, projectId)
      }
      return selectProject(state, projectId)
    }
    case InputName.isSessionInputName(name): {
      const sessionId = InputName.getSessionIdFromInputName(name)
      return selectSession(state, sessionId)
    }
    case InputName.isRenameInputName(name): {
      const sessionId = InputName.getRenameIdFromInputName(name)
      return startRename(state, sessionId)
    }
    case name === InputName.SessionDelete:
      return deleteSession(state, id)
    case name === InputName.Send:
      return handleClickSend(state)
    case name === SaveOpenRouterApiKey:
      return handleClickSaveOpenRouterApiKey(state)
    case name === SaveOpenApiApiKey:
      return handleClickSaveOpenApiApiKey(state)
    case name === OpenOpenRouterApiKeySettings:
      return handleClickOpenRouterApiKeySettings(state)
    case name === OpenOpenRouterApiKeyWebsite:
      return handleClickOpenRouterApiKeyWebsite(state)
    case name === OpenOpenApiApiKeySettings:
      return handleClickOpenApiApiKeySettings(state)
    case name === OpenOpenApiApiKeyWebsite:
      return handleClickOpenApiApiKeyWebsite(state)
    case name === InputName.Login:
      return handleClickLogin(state)
    case name === InputName.Logout:
      return handleClickLogout(state)
    default:
      return state
  }
}

export { handleClickSend } from '../HandleClickSend/HandleClickSend.ts'

export { handleClickList } from '../HandleClickList/HandleClickList.ts'
