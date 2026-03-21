import { terminate } from '@lvce-editor/viewlet-registry'
import * as ChatListFocusFirst from '../ChatListFocusFirst/ChatListFocusFirst.ts'
import * as ChatListFocusLast from '../ChatListFocusLast/ChatListFocusLast.ts'
import * as ChatListFocusNext from '../ChatListFocusNext/ChatListFocusNext.ts'
import * as ChatListFocusPrevious from '../ChatListFocusPrevious/ChatListFocusPrevious.ts'
import * as ClearInput from '../ClearInput/ClearInput.ts'
import * as CopyInput from '../CopyInput/CopyInput.ts'
import * as StatusBar from '../Create/Create.ts'
import * as CutInput from '../CutInput/CutInput.ts'
import { deleteSessionAtIndex } from '../DeleteSession/DeleteSession.ts'
import { diff2 } from '../Diff2/Diff2.ts'
import * as GetAuthState from '../GetAuthState/GetAuthState.ts'
import { getKeyBindings } from '../GetKeyBindings/GetKeyBindings.ts'
import * as GetMenuEntries from '../GetMenuEntries/GetMenuEntries.ts'
import { getMenuEntryIds } from '../GetMenuEntryIds/GetMenuEntryIds.ts'
import { getQuickPickMenuEntries } from '../GetQuickPickMenuEntries/GetQuickPickMenuEntries.ts'
import { getSelectedSessionId } from '../GetSelectedSessionId/GetSelectedSessionId.ts'
import * as HandleChatDetailWelcomeContextMenu from '../HandleChatDetailWelcomeContextMenu/HandleChatDetailWelcomeContextMenu.ts'
import * as HandleChatHeaderContextMenu from '../HandleChatHeaderContextMenu/HandleChatHeaderContextMenu.ts'
import * as HandleChatInputContextMenu from '../HandleChatInputContextMenu/HandleChatInputContextMenu.ts'
import * as HandleChatListContextMenu from '../HandleChatListContextMenu/HandleChatListContextMenu.ts'
import * as HandleClick from '../HandleClick/HandleClick.ts'
import * as HandleClickBack from '../HandleClickBack/HandleClickBack.ts'
import * as HandleClickClose from '../HandleClickClose/HandleClickClose.ts'
import * as HandleClickDelete from '../HandleClickDelete/HandleClickDelete.ts'
import * as HandleClickDictationButton from '../HandleClickDictationButton/HandleClickDictationButton.ts'
import * as HandleClickFileName from '../HandleClickFileName/HandleClickFileName.ts'
import * as HandleClickNew from '../HandleClickNew/HandleClickNew.ts'
import * as HandleClickReadFile from '../HandleClickReadFile/HandleClickReadFile.ts'
import * as HandleClickSessionDebug from '../HandleClickSessionDebug/HandleClickSessionDebug.ts'
import * as HandleClickSettings from '../HandleClickSettings/HandleClickSettings.ts'
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
import * as HandleNewline from '../HandleNewline/HandleNewline.ts'
import * as HandleProjectListContextMenu from '../HandleProjectListContextMenu/HandleProjectListContextMenu.ts'
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
import * as OpenMockSession from '../OpenMockSession/OpenMockSession.ts'
import * as PasteInput from '../PasteInput/PasteInput.ts'
import * as RegisterMockResponse from '../RegisterMockResponse/RegisterMockResponse.ts'
import { render2 } from '../Render2/Render2.ts'
import { renderEventListeners } from '../RenderEventListeners/RenderEventListeners.ts'
import { rerender } from '../Rerender/Rerender.ts'
import * as Reset from '../Reset/Reset.ts'
import { resize } from '../Resize/Resize.ts'
import { saveState } from '../SaveState/SaveState.ts'
import * as SetAddContextButtonEnabled from '../SetAddContextButtonEnabled/SetAddContextButtonEnabled.ts'
import * as SetAuthEnabled from '../SetAuthEnabled/SetAuthEnabled.ts'
import * as SetBackendUrl from '../SetBackendUrl/SetBackendUrl.ts'
import * as SetChatList from '../SetChatList/SetChatList.ts'
import * as SetChatStorageWorkerEnabled from '../SetChatStorageWorkerEnabled/SetChatStorageWorkerEnabled.ts'
import * as SetEmitStreamingFunctionCallEvents from '../SetEmitStreamingFunctionCallEvents/SetEmitStreamingFunctionCallEvents.ts'
import * as SetNewChatModelPickerEnabled from '../SetNewChatModelPickerEnabled/SetNewChatModelPickerEnabled.ts'
import * as SetOpenRouterApiKey from '../SetOpenRouterApiKey/SetOpenRouterApiKey.ts'
import * as SetQuestionToolEnabled from '../SetQuestionToolEnabled/SetQuestionToolEnabled.ts'
import * as SetSearchEnabled from '../SetSearchEnabled/SetSearchEnabled.ts'
import * as SetShowRunMode from '../SetShowRunMode/SetShowRunMode.ts'
import * as SetStreamingEnabled from '../SetStreamingEnabled/SetStreamingEnabled.ts'
import * as SetTodoListToolEnabled from '../SetTodoListToolEnabled/SetTodoListToolEnabled.ts'
import * as SetUseChatCoordinatorWorker from '../SetUseChatCoordinatorWorker/SetUseChatCoordinatorWorker.ts'
import * as SetUseChatMathWorker from '../SetUseChatMathWorker/SetUseChatMathWorker.ts'
import * as SetUseChatNetworkWorkerForRequests from '../SetUseChatNetworkWorkerForRequests/SetUseChatNetworkWorkerForRequests.ts'
import { getCommandIds, wrapCommand, wrapGetter } from '../StatusBarStates/StatusBarStates.ts'
import * as UseMockApi from '../UseMockApi/UseMockApi.ts'

export const commandMap = {
  'Chat.chatListFocusFirst': wrapCommand(ChatListFocusFirst.chatListFocusFirst),
  'Chat.chatListFocusLast': wrapCommand(ChatListFocusLast.chatListFocusLast),
  'Chat.chatListFocusNext': wrapCommand(ChatListFocusNext.chatListFocusNext),
  'Chat.chatListFocusPrevious': wrapCommand(ChatListFocusPrevious.chatListFocusPrevious),
  'Chat.clearInput': wrapCommand(ClearInput.clearInput),
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
  'Chat.handleChatDetailWelcomeContextMenu': wrapCommand(HandleChatDetailWelcomeContextMenu.handleChatDetailWelcomeContextMenu),
  'Chat.handleChatHeaderContextMenu': wrapCommand(HandleChatHeaderContextMenu.handleChatHeaderContextMenu),
  'Chat.handleChatInputContextMenu': wrapCommand(HandleChatInputContextMenu.handleChatInputContextMenu),
  'Chat.handleChatListContextMenu': wrapCommand(HandleChatListContextMenu.handleChatListContextMenu),
  'Chat.handleChatListScroll': wrapCommand(HandleScroll.handleChatListScroll),
  'Chat.handleClick': wrapCommand(HandleClick.handleClick),
  'Chat.handleClickBack': wrapCommand(HandleClickBack.handleClickBack),
  'Chat.handleClickClose': HandleClickClose.handleClickClose,
  'Chat.handleClickDelete': wrapCommand(HandleClickDelete.handleClickDelete),
  'Chat.handleClickDictationButton': wrapCommand(HandleClickDictationButton.handleClickDictationButton),
  'Chat.handleClickFileName': HandleClickFileName.handleClickFileName,
  'Chat.handleClickList': wrapCommand(HandleClick.handleClickList),
  'Chat.handleClickNew': wrapCommand(HandleClickNew.handleClickNew),
  'Chat.handleClickReadFile': HandleClickReadFile.handleClickReadFile,
  'Chat.handleClickSessionDebug': wrapCommand(HandleClickSessionDebug.handleClickSessionDebug),
  'Chat.handleClickSettings': HandleClickSettings.handleClickSettings,
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
  'Chat.handleMissingApiKeySubmit': wrapCommand(HandleMissingApiKeySubmit.handleMissingApiKeySubmit),
  'Chat.handleModelChange': wrapCommand(HandleModelChange.handleModelChange),
  'Chat.handleProjectListContextMenu': wrapCommand(HandleProjectListContextMenu.handleProjectListContextMenu),
  'Chat.handleProjectListScroll': wrapCommand(HandleScroll.handleProjectListScroll),
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
  'Chat.openMockSession': wrapCommand(OpenMockSession.openMockSession),
  'Chat.pasteInput': wrapCommand(PasteInput.pasteInput),
  'Chat.registerMockResponse': wrapCommand(RegisterMockResponse.registerMockResponse),
  'Chat.render2': render2,
  'Chat.renderEventListeners': renderEventListeners,
  'Chat.rerender': wrapCommand(rerender),
  'Chat.reset': wrapCommand(Reset.reset),
  'Chat.resize': wrapCommand(resize),
  'Chat.saveState': wrapGetter(saveState),
  'Chat.setAddContextButtonEnabled': wrapCommand(SetAddContextButtonEnabled.setAddContextButtonEnabled),
  'Chat.setAuthEnabled': wrapCommand(SetAuthEnabled.setAuthEnabled),
  'Chat.setBackendUrl': wrapCommand(SetBackendUrl.setBackendUrl),
  'Chat.setChatList': wrapCommand(SetChatList.setChatList),
  'Chat.setChatStorageWorkerEnabled': wrapCommand(SetChatStorageWorkerEnabled.setChatStorageWorkerEnabled),
  'Chat.setEmitStreamingFunctionCallEvents': wrapCommand(SetEmitStreamingFunctionCallEvents.setEmitStreamingFunctionCallEvents),
  'Chat.setNewChatModelPickerEnabled': wrapCommand(SetNewChatModelPickerEnabled.setNewChatModelPickerEnabled),
  'Chat.setOpenRouterApiKey': wrapCommand(SetOpenRouterApiKey.setOpenRouterApiKey),
  'Chat.setQuestionToolEnabled': wrapCommand(SetQuestionToolEnabled.setQuestionToolEnabled),
  'Chat.setSearchEnabled': wrapCommand(SetSearchEnabled.setSearchEnabled),
  'Chat.setShowRunMode': wrapCommand(SetShowRunMode.setShowRunMode),
  'Chat.setStreamingEnabled': wrapCommand(SetStreamingEnabled.setStreamingEnabled),
  'Chat.setTodoListToolEnabled': wrapCommand(SetTodoListToolEnabled.setTodoListToolEnabled),
  'Chat.setUseChatCoordinatorWorker': wrapCommand(SetUseChatCoordinatorWorker.setUseChatCoordinatorWorker),
  'Chat.setUseChatMathWorker': wrapCommand(SetUseChatMathWorker.setUseChatMathWorker),
  'Chat.setUseChatNetworkWorkerForRequests': wrapCommand(SetUseChatNetworkWorkerForRequests.setUseChatNetworkWorkerForRequests),
  'Chat.terminate': terminate,
  'Chat.useMockApi': wrapCommand(UseMockApi.useMockApi),
}
