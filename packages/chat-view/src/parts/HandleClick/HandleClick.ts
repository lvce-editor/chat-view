import type { ChatState } from '../ChatState/ChatState.ts'
import { createSession } from '../CreateSession/CreateSession.ts'
import { deleteSession } from '../DeleteSession/DeleteSession.ts'
import { getModelPickerClickIndex } from '../GetModelPickerClickIndex/GetModelPickerClickIndex.ts'
import { getModelPickerHeight } from '../GetModelPickerHeight/GetModelPickerHeight.ts'
import { handleAgentModeChange } from '../HandleAgentModeChange/HandleAgentModeChange.ts'
import { handleClickCreateProject } from '../HandleClickCreateProject/HandleClickCreateProject.ts'
import { handleClickCreatePullRequest } from '../HandleClickCreatePullRequest/HandleClickCreatePullRequest.ts'
import { handleClickLogin } from '../HandleClickLogin/HandleClickLogin.ts'
import { handleClickLogout } from '../HandleClickLogout/HandleClickLogout.ts'
import { handleClickModelPickerListIndex } from '../HandleClickModelPickerListIndex/HandleClickModelPickerListIndex.ts'
import { handleClickOpenApiApiKeySettings } from '../HandleClickOpenApiApiKeySettings/HandleClickOpenApiApiKeySettings.ts'
import { handleClickOpenApiApiKeyWebsite } from '../HandleClickOpenApiApiKeyWebsite/HandleClickOpenApiApiKeyWebsite.ts'
import { handleClickOpenRouterApiKeySettings } from '../HandleClickOpenRouterApiKeySettings/HandleClickOpenRouterApiKeySettings.ts'
import { handleClickOpenRouterApiKeyWebsite } from '../HandleClickOpenRouterApiKeyWebsite/HandleClickOpenRouterApiKeyWebsite.ts'
import { handleClickSaveOpenApiApiKey } from '../HandleClickSaveOpenApiApiKey/HandleClickSaveOpenApiApiKey.ts'
import { handleClickSaveOpenRouterApiKey } from '../HandleClickSaveOpenRouterApiKey/HandleClickSaveOpenRouterApiKey.ts'
import { handleClickSend } from '../HandleClickSend/HandleClickSend.ts'
import { handleReasoningEffortChange } from '../HandleReasoningEffortChange/HandleReasoningEffortChange.ts'
import { handleRemoveComposerAttachment } from '../HandleRemoveComposerAttachment/HandleRemoveComposerAttachment.ts'
import * as InputName from '../InputName/InputName.ts'
import { openAgentModePicker } from '../OpenAgentModePicker/OpenAgentModePicker.ts'
import { OpenOpenApiApiKeySettings, OpenOpenApiApiKeyWebsite, SaveOpenApiApiKey } from '../OpenApiApiKeyNames/OpenApiApiKeyNames.ts'
import { openReasoningEffortPicker } from '../OpenReasoningEffortPicker/OpenReasoningEffortPicker.ts'
import { OpenOpenRouterApiKeySettings, OpenOpenRouterApiKeyWebsite, SaveOpenRouterApiKey } from '../OpenRouterApiKeyNames/OpenRouterApiKeyNames.ts'
import { openRunModePicker } from '../OpenRunModePicker/OpenRunModePicker.ts'
import { selectProject } from '../SelectProject/SelectProject.ts'
import { selectSession } from '../SelectSession/SelectSession.ts'
import { startRename } from '../StartRename/StartRename.ts'
import { toggleChatFocusMode } from '../ToggleChatFocusMode/ToggleChatFocusMode.ts'
import { toggleProjectExpanded } from '../ToggleProjectExpanded/ToggleProjectExpanded.ts'

export const handleClick = async (state: ChatState, name: string, id = '', eventX = 0, eventY = 0): Promise<ChatState> => {
  if (!name) {
    return state
  }
  switch (true) {
    case name === InputName.CreateSession:
      return createSession(state)
    case name === InputName.CreateProject:
      return handleClickCreateProject(state)
    case name === InputName.CreatePullRequest:
      return handleClickCreatePullRequest(state)
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
    case name === InputName.RunModePickerToggle:
      return openRunModePicker(state)
    case name === InputName.AgentModePickerToggle:
      return openAgentModePicker(state)
    case name === InputName.ReasoningEffortPickerToggle:
      return openReasoningEffortPicker(state)
    case InputName.isModelPickerItemInputName(name): {
      const modelId = InputName.getModelIdFromModelPickerItemInputName(name)
      return {
        ...state,
        agentModePickerOpen: false,
        modelPickerHeight: getModelPickerHeight(state.modelPickerHeaderHeight, state.models.length),
        modelPickerListScrollTop: 0,
        modelPickerOpen: false,
        modelPickerSearchValue: '',
        reasoningEffortPickerOpen: false,
        selectedModelId: modelId,
        visibleModels: state.models,
      }
    }
    case InputName.isAgentModePickerItemInputName(name): {
      const agentMode = InputName.getAgentModeFromAgentModePickerItemInputName(name)
      return handleAgentModeChange(state, agentMode)
    }
    case InputName.isReasoningEffortPickerItemInputName(name): {
      const reasoningEffort = InputName.getReasoningEffortFromReasoningEffortPickerItemInputName(name)
      return handleReasoningEffortChange(state, reasoningEffort)
    }
    case InputName.isRunModePickerItemInputName(name): {
      const runMode = InputName.getRunModeFromRunModePickerItemInputName(name)
      return {
        ...state,
        agentModePickerOpen: false,
        reasoningEffortPickerOpen: false,
        runMode,
        runModePickerOpen: false,
      }
    }
    case name === InputName.ModelPickerList: {
      const itemHeight = 28
      const bottomOffset = 90
      const headerHeight = 40
      const index = getModelPickerClickIndex(
        state.y,
        state.height,
        eventY,
        bottomOffset,
        itemHeight,
        state.modelPickerHeight,
        headerHeight,
        state.modelPickerListScrollTop,
      )
      return handleClickModelPickerListIndex(state, index)
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
    case InputName.isComposerAttachmentRemoveInputName(name): {
      const attachmentId = InputName.getAttachmentIdFromComposerAttachmentRemoveInputName(name)
      return handleRemoveComposerAttachment(state, attachmentId)
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
