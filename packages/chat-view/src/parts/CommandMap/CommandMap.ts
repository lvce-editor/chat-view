import { terminate } from '@lvce-editor/viewlet-registry'
import * as ChatInputHistoryDown from '../ChatInputHistoryDown/ChatInputHistoryDown.ts'
import * as ChatInputHistoryUp from '../ChatInputHistoryUp/ChatInputHistoryUp.ts'
import * as ChatListFocusFirst from '../ChatListFocusFirst/ChatListFocusFirst.ts'
import * as ChatListFocusLast from '../ChatListFocusLast/ChatListFocusLast.ts'
import * as ChatListFocusNext from '../ChatListFocusNext/ChatListFocusNext.ts'
import * as ChatListFocusPrevious from '../ChatListFocusPrevious/ChatListFocusPrevious.ts'
import * as ClearInput from '../ClearInput/ClearInput.ts'
import { closeGitBranchPicker } from '../CloseGitBranchPicker/CloseGitBranchPicker.ts'
import * as CopyInput from '../CopyInput/CopyInput.ts'
import * as StatusBar from '../Create/Create.ts'
import * as CutInput from '../CutInput/CutInput.ts'
import { deleteSessionAtIndex } from '../DeleteSessionAtIndex/DeleteSessionAtIndex.ts'
import { diff2 } from '../Diff2/Diff2.ts'
import * as GetAuthState from '../GetAuthState/GetAuthState.ts'
import { getKeyBindings } from '../GetKeyBindings/GetKeyBindings.ts'
import * as GetMenuEntries from '../GetMenuEntries/GetMenuEntries.ts'
import { getMenuEntryIds } from '../GetMenuEntryIds/GetMenuEntryIds.ts'
import { getQuickPickMenuEntries } from '../GetQuickPickMenuEntries/GetQuickPickMenuEntries.ts'
import { getSelectedSessionId } from '../GetSelectedSessionId/GetSelectedSessionId.ts'
import * as GetSystemPrompt from '../GetSystemPrompt/GetSystemPrompt.ts'
import * as HandleAgentModeChange from '../HandleAgentModeChange/HandleAgentModeChange.ts'
import * as HandleChatDetailWelcomeContextMenu from '../HandleChatDetailWelcomeContextMenu/HandleChatDetailWelcomeContextMenu.ts'
import * as HandleChatHeaderContextMenu from '../HandleChatHeaderContextMenu/HandleChatHeaderContextMenu.ts'
import * as HandleChatInputContextMenu from '../HandleChatInputContextMenu/HandleChatInputContextMenu.ts'
import * as HandleChatListContextMenu from '../HandleChatListContextMenu/HandleChatListContextMenu.ts'
import * as HandleClick from '../HandleClick/HandleClick.ts'
import * as HandleClickBack from '../HandleClickBack/HandleClickBack.ts'
import * as HandleClickClose from '../HandleClickClose/HandleClickClose.ts'
import * as HandleClickCreatePullRequest from '../HandleClickCreatePullRequest/HandleClickCreatePullRequest.ts'
import * as HandleClickDelete from '../HandleClickDelete/HandleClickDelete.ts'
import * as HandleClickDictationButton from '../HandleClickDictationButton/HandleClickDictationButton.ts'
import * as HandleClickFileName from '../HandleClickFileName/HandleClickFileName.ts'
import * as HandleClickGitBranchPickerToggle from '../HandleClickGitBranchPickerToggle/HandleClickGitBranchPickerToggle.ts'
import { handleClickModelPickerList } from '../HandleClickModelPickerList/HandleClickModelPickerList.ts'
import { handleClickModelPickerListIndex } from '../HandleClickModelPickerListIndex/HandleClickModelPickerListIndex.ts'
import * as HandleClickModelPickerOverlay from '../HandleClickModelPickerOverlay/HandleClickModelPickerOverlay.ts'
import * as HandleClickModelPickerToggle from '../HandleClickModelPickerToggle/HandleClickModelPickerToggle.ts'
import * as HandleClickNew from '../HandleClickNew/HandleClickNew.ts'
import * as HandleClickReadFile from '../HandleClickReadFile/HandleClickReadFile.ts'
import * as HandleClickSessionDebug from '../HandleClickSessionDebug/HandleClickSessionDebug.ts'
import * as HandleClickSettings from '../HandleClickSettings/HandleClickSettings.ts'
import * as HandleContextMenuChatImageAttachment from '../HandleContextMenuChatImageAttachment/HandleContextMenuChatImageAttachment.ts'
import * as HandleContextMenuChatModelPicker from '../HandleContextMenuChatModelPicker/HandleContextMenuChatModelPicker.ts'
import * as HandleContextMenuChatSendAreaBottom from '../HandleContextMenuChatSendAreaBottom/HandleContextMenuChatSendAreaBottom.ts'
import * as HandleDragEnter from '../HandleDragEnter/HandleDragEnter.ts'
import * as HandleDragLeave from '../HandleDragLeave/HandleDragLeave.ts'
import * as HandleDragOver from '../HandleDragOver/HandleDragOver.ts'
import * as HandleDropFiles from '../HandleDropFiles/HandleDropFiles.ts'
import * as HandleInput from '../HandleInput/HandleInput.ts'
import * as HandleInputFocus from '../HandleInputFocus/HandleInputFocus.ts'
import * as HandleKeyDown from '../HandleKeyDown/HandleKeyDown.ts'
import * as HandleMessagesContextMenu from '../HandleMessagesContextMenu/HandleMessagesContextMenu.ts'
import * as HandleMissingApiKeySubmit from '../HandleMissingApiKeySubmit/HandleMissingApiKeySubmit.ts'
import * as HandleModelChange from '../HandleModelChange/HandleModelChange.ts'
import { handleModelInputBlur } from '../HandleModelInputBlur/HandleModelInputBlur.ts'
import * as HandleNewline from '../HandleNewline/HandleNewline.ts'
import * as HandlePointerDownModelPickerList from '../HandlePointerDownModelPickerList/HandlePointerDownModelPickerList.ts'
import { handlePointerUpModelPickerList } from '../HandlePointerUpModelPickerList/HandlePointerUpModelPickerList.ts'
import * as HandleProjectAddButtonContextMenu from '../HandleProjectAddButtonContextMenu/HandleProjectAddButtonContextMenu.ts'
import * as HandleProjectListContextMenu from '../HandleProjectListContextMenu/HandleProjectListContextMenu.ts'
import * as HandleReasoningEffortChange from '../HandleReasoningEffortChange/HandleReasoningEffortChange.ts'
import * as HandleRunModeChange from '../HandleRunModeChange/HandleRunModeChange.ts'
import * as HandleScroll from '../HandleScroll/HandleScroll.ts'
import * as HandleSearchValueChange from '../HandleSearchValueChange/HandleSearchValueChange.ts'
import * as HandleSubmit from '../HandleSubmit/HandleSubmit.ts'
import { initialize } from '../Initialize/Initialize.ts'
import * as LoadContent from '../LoadContent/LoadContent.ts'
import * as MockBackendAuthResponse from '../MockBackendAuthResponse/MockBackendAuthResponse.ts'
import * as MockOpenApiRequestGetAll from '../MockOpenApiRequestGetAll/MockOpenApiRequestGetAll.ts'
import * as MockOpenApiRequestReset from '../MockOpenApiRequestReset/MockOpenApiRequestReset.ts'
import * as MockOpenApiSetHttpErrorResponse from '../MockOpenApiSetHttpErrorResponse/MockOpenApiSetHttpErrorResponse.ts'
import * as MockOpenApiSetRequestFailedResponse from '../MockOpenApiSetRequestFailedResponse/MockOpenApiSetRequestFailedResponse.ts'
import * as MockOpenApiStreamFinish from '../MockOpenApiStreamFinish/MockOpenApiStreamFinish.ts'
import * as MockOpenApiStreamPushChunk from '../MockOpenApiStreamPushChunk/MockOpenApiStreamPushChunk.ts'
import * as MockOpenApiStreamReset from '../MockOpenApiStreamReset/MockOpenApiStreamReset.ts'
import { openAgentModePicker } from '../OpenAgentModePicker/OpenAgentModePicker.ts'
import { openGitBranchPicker } from '../OpenGitBranchPicker/OpenGitBranchPicker.ts'
import * as OpenMockSession from '../OpenMockSession/OpenMockSession.ts'
import { openModelPicker } from '../OpenModelPicker/OpenModelPicker.ts'
import { openReasoningEffortPicker } from '../OpenReasoningEffortPicker/OpenReasoningEffortPicker.ts'
import { openRunModePicker } from '../OpenRunModePicker/OpenRunModePicker.ts'
import * as PasteInput from '../PasteInput/PasteInput.ts'
import * as RegisterMockResponse from '../RegisterMockResponse/RegisterMockResponse.ts'
import * as RemoveComposerAttachment from '../RemoveComposerAttachment/RemoveComposerAttachment.ts'
import { render2 } from '../Render2/Render2.ts'
import { renderEventListeners } from '../RenderEventListeners/RenderEventListeners.ts'
import { rerender } from '../Rerender/Rerender.ts'
import * as Reset from '../Reset/Reset.ts'
import { resize } from '../Resize/Resize.ts'
import { saveState } from '../SaveState/SaveState.ts'
import * as SetAddContextButtonEnabled from '../SetAddContextButtonEnabled/SetAddContextButtonEnabled.ts'
import * as SetAuthEnabled from '../SetAuthEnabled/SetAuthEnabled.ts'
import * as SetBackendUrl from '../SetBackendUrl/SetBackendUrl.ts'
import * as SetChatHistoryEnabled from '../SetChatHistoryEnabled/SetChatHistoryEnabled.ts'
import * as SetComposerSelection from '../SetComposerSelection/SetComposerSelection.ts'
import * as SetEmitStreamingFunctionCallEvents from '../SetEmitStreamingFunctionCallEvents/SetEmitStreamingFunctionCallEvents.ts'
import * as SetOpenRouterApiKey from '../SetOpenRouterApiKey/SetOpenRouterApiKey.ts'
import * as SetQuestionToolEnabled from '../SetQuestionToolEnabled/SetQuestionToolEnabled.ts'
import * as SetReasoningEffort from '../SetReasoningEffort/SetReasoningEffort.ts'
import * as SetReasoningPickerEnabled from '../SetReasoningPickerEnabled/SetReasoningPickerEnabled.ts'
import * as SetResponsivePickerVisibilityEnabled from '../SetResponsivePickerVisibilityEnabled/SetResponsivePickerVisibilityEnabled.ts'
import * as SetScrollDownButtonEnabled from '../SetScrollDownButtonEnabled/SetScrollDownButtonEnabled.ts'
import * as SetSearchEnabled from '../SetSearchEnabled/SetSearchEnabled.ts'
import * as SetShowRunMode from '../SetShowRunMode/SetShowRunMode.ts'
import * as SetStreamingEnabled from '../SetStreamingEnabled/SetStreamingEnabled.ts'
import * as SetSystemPrompt from '../SetSystemPrompt/SetSystemPrompt.ts'
import * as SetTodoListToolEnabled from '../SetTodoListToolEnabled/SetTodoListToolEnabled.ts'
import * as SetToolEnablement from '../SetToolEnablement/SetToolEnablement.ts'
import * as SetUseChatCoordinatorWorker from '../SetUseChatCoordinatorWorker/SetUseChatCoordinatorWorker.ts'
import * as SetUseChatMathWorker from '../SetUseChatMathWorker/SetUseChatMathWorker.ts'
import * as SetUseChatMessageParsingWorker from '../SetUseChatMessageParsingWorker/SetUseChatMessageParsingWorker.ts'
import * as SetUseChatNetworkWorkerForRequests from '../SetUseChatNetworkWorkerForRequests/SetUseChatNetworkWorkerForRequests.ts'
import { getCommandIds, wrapCommand, wrapGetter } from '../StatusBarStates/StatusBarStates.ts'
import * as UseMockApi from '../UseMockApi/UseMockApi.ts'

export const commandMap = {
  'Chat.chatInputHistoryDown': wrapCommand(ChatInputHistoryDown.chatInputHistoryDown),
  'Chat.chatInputHistoryUp': wrapCommand(ChatInputHistoryUp.chatInputHistoryUp),
  'Chat.chatListFocusFirst': wrapCommand(ChatListFocusFirst.chatListFocusFirst),
  'Chat.chatListFocusLast': wrapCommand(ChatListFocusLast.chatListFocusLast),
  'Chat.chatListFocusNext': wrapCommand(ChatListFocusNext.chatListFocusNext),
  'Chat.chatListFocusPrevious': wrapCommand(ChatListFocusPrevious.chatListFocusPrevious),
  'Chat.clearInput': wrapCommand(ClearInput.clearInput),
  'Chat.closeGitBranchPicker': wrapCommand(closeGitBranchPicker),
  'Chat.copyInput': wrapCommand(CopyInput.copyInput),
  'Chat.create': StatusBar.create,
  'Chat.cutInput': wrapCommand(CutInput.cutInput),
  'Chat.deleteSessionAtIndex': wrapCommand(deleteSessionAtIndex),
  'Chat.diff2': diff2,
  'Chat.enterNewLine': wrapCommand(HandleNewline.handleNewline),
  'Chat.getAuthState': wrapGetter(GetAuthState.getAuthState),
  'Chat.getCommandIds': getCommandIds,
  'Chat.getKeyBindings': getKeyBindings,
  'Chat.getMenuEntries': GetMenuEntries.getMenuEntries,
  'Chat.getMenuEntryIds': getMenuEntryIds,
  'Chat.getQuickPickMenuEntries': getQuickPickMenuEntries,
  'Chat.getSelectedSessionId': wrapGetter(getSelectedSessionId),
  'Chat.getSystemPrompt': wrapGetter(GetSystemPrompt.getSystemPrompt),
  'Chat.handleAgentModeChange': wrapCommand(HandleAgentModeChange.handleAgentModeChange),
  'Chat.handleChatDetailWelcomeContextMenu': wrapCommand(HandleChatDetailWelcomeContextMenu.handleChatDetailWelcomeContextMenu),
  'Chat.handleChatHeaderContextMenu': wrapCommand(HandleChatHeaderContextMenu.handleChatHeaderContextMenu),
  'Chat.handleChatInputContextMenu': wrapCommand(HandleChatInputContextMenu.handleChatInputContextMenu),
  'Chat.handleChatListContextMenu': wrapCommand(HandleChatListContextMenu.handleChatListContextMenu),
  'Chat.handleChatListScroll': wrapCommand(HandleScroll.handleChatListScroll),
  'Chat.handleClick': wrapCommand(HandleClick.handleClick),
  'Chat.handleClickBack': wrapCommand(HandleClickBack.handleClickBack),
  'Chat.handleClickClose': HandleClickClose.handleClickClose,
  'Chat.handleClickCreatePullRequest': wrapCommand(HandleClickCreatePullRequest.handleClickCreatePullRequest),
  'Chat.handleClickDelete': wrapCommand(HandleClickDelete.handleClickDelete),
  'Chat.handleClickDictationButton': wrapCommand(HandleClickDictationButton.handleClickDictationButton),
  'Chat.handleClickFileName': wrapCommand(HandleClickFileName.handleClickFileName),
  'Chat.handleClickGitBranchPickerToggle': wrapCommand(HandleClickGitBranchPickerToggle.handleClickGitBranchPickerToggle),
  'Chat.handleClickList': wrapCommand(HandleClick.handleClickList),
  'Chat.handleClickModelPickerList': wrapCommand(handleClickModelPickerList),
  'Chat.handleClickModelPickerListIndex': wrapCommand(handleClickModelPickerListIndex),
  'Chat.handleClickModelPickerOverlay': wrapCommand(HandleClickModelPickerOverlay.handleClickModelPickerOverlay),
  'Chat.handleClickModelPickerToggle': wrapCommand(HandleClickModelPickerToggle.handleClickModelPickerToggle),
  'Chat.handleClickNew': wrapCommand(HandleClickNew.handleClickNew),
  'Chat.handleClickReadFile': wrapCommand(HandleClickReadFile.handleClickReadFile),
  'Chat.handleClickSessionDebug': wrapCommand(HandleClickSessionDebug.handleClickSessionDebug),
  'Chat.handleClickSettings': HandleClickSettings.handleClickSettings,
  'Chat.handleContextMenuChatImageAttachment': wrapCommand(HandleContextMenuChatImageAttachment.handleContextMenuChatImageAttachment),
  'Chat.handleContextMenuChatModelPicker': wrapCommand(HandleContextMenuChatModelPicker.handleContextMenuChatModelPicker),
  'Chat.handleContextMenuChatSendAreaBottom': wrapCommand(HandleContextMenuChatSendAreaBottom.handleContextMenuChatSendAreaBottom),
  'Chat.handleDragEnter': wrapCommand(HandleDragEnter.handleDragEnter),
  'Chat.handleDragLeave': wrapCommand(HandleDragLeave.handleDragLeave),
  'Chat.handleDragOver': wrapCommand(HandleDragOver.handleDragOver),
  'Chat.handleDropFiles': wrapCommand(HandleDropFiles.handleDropFiles),
  'Chat.handleInput': wrapCommand(HandleInput.handleInput),
  'Chat.handleInputFocus': wrapCommand(HandleInputFocus.handleInputFocus),
  'Chat.handleKeyDown': wrapCommand(HandleKeyDown.handleKeyDown),
  'Chat.handleMessagesContextMenu': wrapCommand(HandleMessagesContextMenu.handleMessagesContextMenu),
  'Chat.handleMessagesScroll': wrapCommand(HandleScroll.handleMessagesScroll),
  'Chat.handleMissingOpenAiApiKeyFormSubmit': wrapCommand(HandleMissingApiKeySubmit.handleMissingOpenAiApiKeyFormSubmit),
  'Chat.handleMissingOpenRouterApiKeyFormSubmit': wrapCommand(HandleMissingApiKeySubmit.handleMissingOpenRouterApiKeyFormSubmit),
  'Chat.handleModelChange': wrapCommand(HandleModelChange.handleModelChange),
  'Chat.handleModelInputBlur': wrapCommand(handleModelInputBlur),
  'Chat.handleModelPickerListScroll': wrapCommand(HandleScroll.handleModelPickerListScroll),
  'Chat.handlePointerDownModelPickerList': wrapCommand(HandlePointerDownModelPickerList.handlePointerDownModelPickerList),
  'Chat.handlePointerUpModelPickerList': wrapCommand(handlePointerUpModelPickerList),
  'Chat.handleProjectAddButtonContextMenu': wrapCommand(HandleProjectAddButtonContextMenu.handleProjectAddButtonContextMenu),
  'Chat.handleProjectListContextMenu': wrapCommand(HandleProjectListContextMenu.handleProjectListContextMenu),
  'Chat.handleProjectListScroll': wrapCommand(HandleScroll.handleProjectListScroll),
  'Chat.handleReasoningEffortChange': wrapCommand(HandleReasoningEffortChange.handleReasoningEffortChange),
  'Chat.handleRunModeChange': wrapCommand(HandleRunModeChange.handleRunModeChange),
  'Chat.handleSearchValueChange': wrapCommand(HandleSearchValueChange.handleSearchValueChange),
  'Chat.handleSubmit': wrapCommand(HandleSubmit.handleSubmit),
  'Chat.initialize': initialize,
  'Chat.loadContent': wrapCommand(LoadContent.loadContent),
  'Chat.loadContent2': wrapCommand(LoadContent.loadContent),
  'Chat.mockBackendAuthResponse': wrapCommand(MockBackendAuthResponse.mockBackendAuthResponse),
  'Chat.mockOpenApiRequestGetAll': wrapGetter(MockOpenApiRequestGetAll.mockOpenApiRequestGetAll),
  'Chat.mockOpenApiRequestReset': wrapCommand(MockOpenApiRequestReset.mockOpenApiRequestReset),
  'Chat.mockOpenApiSetHttpErrorResponse': wrapCommand(MockOpenApiSetHttpErrorResponse.mockOpenApiSetHttpErrorResponse),
  'Chat.mockOpenApiSetRequestFailedResponse': wrapCommand(MockOpenApiSetRequestFailedResponse.mockOpenApiSetRequestFailedResponse),
  'Chat.mockOpenApiStreamFinish': wrapCommand(MockOpenApiStreamFinish.mockOpenApiStreamFinish),
  'Chat.mockOpenApiStreamPushChunk': wrapCommand(MockOpenApiStreamPushChunk.mockOpenApiStreamPushChunk),
  'Chat.mockOpenApiStreamReset': wrapCommand(MockOpenApiStreamReset.mockOpenApiStreamReset),
  'Chat.openAgentModePicker': wrapCommand(openAgentModePicker),
  'Chat.openGitBranchPicker': wrapCommand(openGitBranchPicker),
  'Chat.openMockSession': wrapCommand(OpenMockSession.openMockSession),
  'Chat.openModelPicker': wrapCommand(openModelPicker),
  'Chat.openReasoningEffortPicker': wrapCommand(openReasoningEffortPicker),
  'Chat.openRunModePicker': wrapCommand(openRunModePicker),
  'Chat.pasteInput': wrapCommand(PasteInput.pasteInput),
  'Chat.registerMockResponse': wrapCommand(RegisterMockResponse.registerMockResponse),
  'Chat.removeComposerAttachment': wrapCommand(RemoveComposerAttachment.removeComposerAttachment),
  'Chat.render2': render2,
  'Chat.renderEventListeners': renderEventListeners,
  'Chat.rerender': wrapCommand(rerender),
  'Chat.reset': wrapCommand(Reset.reset),
  'Chat.resize': wrapCommand(resize),
  'Chat.saveState': wrapGetter(saveState),
  'Chat.setAddContextButtonEnabled': wrapCommand(SetAddContextButtonEnabled.setAddContextButtonEnabled),
  'Chat.setAuthEnabled': wrapCommand(SetAuthEnabled.setAuthEnabled),
  'Chat.setBackendUrl': wrapCommand(SetBackendUrl.setBackendUrl),
  'Chat.setChatHistoryEnabled': wrapCommand(SetChatHistoryEnabled.setChatHistoryEnabled),
  'Chat.setComposerSelection': wrapCommand(SetComposerSelection.setComposerSelection),
  'Chat.setEmitStreamingFunctionCallEvents': wrapCommand(SetEmitStreamingFunctionCallEvents.setEmitStreamingFunctionCallEvents),
  'Chat.setOpenRouterApiKey': wrapCommand(SetOpenRouterApiKey.setOpenRouterApiKey),
  'Chat.setQuestionToolEnabled': wrapCommand(SetQuestionToolEnabled.setQuestionToolEnabled),
  'Chat.setReasoningEffort': wrapCommand(SetReasoningEffort.setReasoningEffort),
  'Chat.setReasoningPickerEnabled': wrapCommand(SetReasoningPickerEnabled.setReasoningPickerEnabled),
  'Chat.setResponsivePickerVisibilityEnabled': wrapCommand(SetResponsivePickerVisibilityEnabled.setResponsivePickerVisibilityEnabled),
  'Chat.setScrollDownButtonEnabled': wrapCommand(SetScrollDownButtonEnabled.setScrollDownButtonEnabled),
  'Chat.setSearchEnabled': wrapCommand(SetSearchEnabled.setSearchEnabled),
  'Chat.setShowRunMode': wrapCommand(SetShowRunMode.setShowRunMode),
  'Chat.setStreamingEnabled': wrapCommand(SetStreamingEnabled.setStreamingEnabled),
  'Chat.setSystemPrompt': wrapCommand(SetSystemPrompt.setSystemPrompt),
  'Chat.setTodoListToolEnabled': wrapCommand(SetTodoListToolEnabled.setTodoListToolEnabled),
  'Chat.setToolEnablement': wrapCommand(SetToolEnablement.setToolEnablement),
  'Chat.setUseChatCoordinatorWorker': wrapCommand(SetUseChatCoordinatorWorker.setUseChatCoordinatorWorker),
  'Chat.setUseChatMathWorker': wrapCommand(SetUseChatMathWorker.setUseChatMathWorker),
  'Chat.setUseChatMessageParsingWorker': wrapCommand(SetUseChatMessageParsingWorker.setUseChatMessageParsingWorker),
  'Chat.setUseChatNetworkWorkerForRequests': wrapCommand(SetUseChatNetworkWorkerForRequests.setUseChatNetworkWorkerForRequests),
  'Chat.terminate': terminate,
  'Chat.useMockApi': wrapCommand(UseMockApi.useMockApi),
}
