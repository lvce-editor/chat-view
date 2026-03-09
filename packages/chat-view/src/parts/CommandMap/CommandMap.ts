import { terminate } from '@lvce-editor/viewlet-registry'
import * as ClearInput from '../ClearInput/ClearInput.ts'
import * as StatusBar from '../Create/Create.ts'
import { diff2 } from '../Diff2/Diff2.ts'
import { getKeyBindings } from '../GetKeyBindings/GetKeyBindings.ts'
import { getSelectedSessionId } from '../GetSelectedSessionId/GetSelectedSessionId.ts'
import * as HandleChatListContextMenu from '../HandleChatListContextMenu/HandleChatListContextMenu.ts'
import * as HandleClick from '../HandleClick/HandleClick.ts'
import * as HandleClickBack from '../HandleClickBack/HandleClickBack.ts'
import * as HandleClickClose from '../HandleClickClose/HandleClickClose.ts'
import * as HandleClickDelete from '../HandleClickDelete/HandleClickDelete.ts'
import * as HandleClickNew from '../HandleClickNew/HandleClickNew.ts'
import * as HandleClickSessionDebug from '../HandleClickSessionDebug/HandleClickSessionDebug.ts'
import * as HandleClickSettings from '../HandleClickSettings/HandleClickSettings.ts'
import * as HandleInput from '../HandleInput/HandleInput.ts'
import * as HandleInputFocus from '../HandleInputFocus/HandleInputFocus.ts'
import * as HandleKeyDown from '../HandleKeyDown/HandleKeyDown.ts'
import * as HandleModelChange from '../HandleModelChange/HandleModelChange.ts'
import * as HandleNewline from '../HandleNewline/HandleNewline.ts'
import * as HandleScroll from '../HandleScroll/HandleScroll.ts'
import * as HandleSubmit from '../HandleSubmit/HandleSubmit.ts'
import { initialize } from '../Initialize/Initialize.ts'
import * as LoadContent from '../LoadContent/LoadContent.ts'
import * as MockOpenApiSetHttpErrorResponse from '../MockOpenApiSetHttpErrorResponse/MockOpenApiSetHttpErrorResponse.ts'
import * as MockOpenApiStreamFinish from '../MockOpenApiStreamFinish/MockOpenApiStreamFinish.ts'
import * as MockOpenApiStreamPushChunk from '../MockOpenApiStreamPushChunk/MockOpenApiStreamPushChunk.ts'
import * as MockOpenApiStreamReset from '../MockOpenApiStreamReset/MockOpenApiStreamReset.ts'
import * as OpenMockSession from '../OpenMockSession/OpenMockSession.ts'
import { render2 } from '../Render2/Render2.ts'
import { renderEventListeners } from '../RenderEventListeners/RenderEventListeners.ts'
import { rerender } from '../Rerender/Rerender.ts'
import * as Reset from '../Reset/Reset.ts'
import { resize } from '../Resize/Resize.ts'
import { saveState } from '../SaveState/SaveState.ts'
import * as SetChatList from '../SetChatList/SetChatList.ts'
import * as SetEmitStreamingFunctionCallEvents from '../SetEmitStreamingFunctionCallEvents/SetEmitStreamingFunctionCallEvents.ts'
import * as SetOpenRouterApiKey from '../SetOpenRouterApiKey/SetOpenRouterApiKey.ts'
import * as SetStreamingEnabled from '../SetStreamingEnabled/SetStreamingEnabled.ts'
import { getCommandIds, wrapCommand, wrapGetter } from '../StatusBarStates/StatusBarStates.ts'
import * as UseMockApi from '../UseMockApi/UseMockApi.ts'

export const commandMap = {
  'Chat.clearInput': wrapCommand(ClearInput.clearInput),
  'Chat.create': StatusBar.create,
  'Chat.diff2': diff2,
  'Chat.enterNewLine': wrapCommand(HandleNewline.handleNewline),
  'Chat.getCommandIds': getCommandIds,
  'Chat.getKeyBindings': getKeyBindings,
  'Chat.getSelectedSessionId': wrapGetter(getSelectedSessionId),
  'Chat.handleChatListContextMenu': HandleChatListContextMenu.handleChatListContextMenu,
  'Chat.handleChatListScroll': wrapCommand(HandleScroll.handleChatListScroll),
  'Chat.handleClick': wrapCommand(HandleClick.handleClick),
  'Chat.handleClickBack': wrapCommand(HandleClickBack.handleClickBack),
  'Chat.handleClickClose': HandleClickClose.handleClickClose,
  'Chat.handleClickDelete': wrapCommand(HandleClickDelete.handleClickDelete),
  'Chat.handleClickList': wrapCommand(HandleClick.handleClickList),
  'Chat.handleClickNew': wrapCommand(HandleClickNew.handleClickNew),
  'Chat.handleClickSessionDebug': wrapCommand(HandleClickSessionDebug.handleClickSessionDebug),
  'Chat.handleClickSettings': HandleClickSettings.handleClickSettings,
  'Chat.handleInput': wrapCommand(HandleInput.handleInput),
  'Chat.handleInputFocus': wrapCommand(HandleInputFocus.handleInputFocus),
  'Chat.handleKeyDown': wrapCommand(HandleKeyDown.handleKeyDown),
  'Chat.handleMessagesScroll': wrapCommand(HandleScroll.handleMessagesScroll),
  'Chat.handleModelChange': wrapCommand(HandleModelChange.handleModelChange),
  'Chat.handleSubmit': wrapCommand(HandleSubmit.handleSubmit),
  'Chat.initialize': initialize,
  'Chat.loadContent': wrapCommand(LoadContent.loadContent),
  'Chat.loadContent2': wrapCommand(LoadContent.loadContent),
  'Chat.mockOpenApiSetHttpErrorResponse': wrapCommand(MockOpenApiSetHttpErrorResponse.mockOpenApiSetHttpErrorResponse),
  'Chat.mockOpenApiStreamFinish': wrapCommand(MockOpenApiStreamFinish.mockOpenApiStreamFinish),
  'Chat.mockOpenApiStreamPushChunk': wrapCommand(MockOpenApiStreamPushChunk.mockOpenApiStreamPushChunk),
  'Chat.mockOpenApiStreamReset': wrapCommand(MockOpenApiStreamReset.mockOpenApiStreamReset),
  'Chat.openMockSession': wrapCommand(OpenMockSession.openMockSession),
  'Chat.render2': render2,
  'Chat.renderEventListeners': renderEventListeners,
  'Chat.rerender': wrapCommand(rerender),
  'Chat.reset': wrapCommand(Reset.reset),
  'Chat.resize': wrapCommand(resize),
  'Chat.saveState': wrapGetter(saveState),
  'Chat.setChatList': wrapCommand(SetChatList.setChatList),
  'Chat.setEmitStreamingFunctionCallEvents': wrapCommand(SetEmitStreamingFunctionCallEvents.setEmitStreamingFunctionCallEvents),
  'Chat.setOpenRouterApiKey': wrapCommand(SetOpenRouterApiKey.setOpenRouterApiKey),
  'Chat.setStreamingEnabled': wrapCommand(SetStreamingEnabled.setStreamingEnabled),
  'Chat.terminate': terminate,
  'Chat.useMockApi': wrapCommand(UseMockApi.useMockApi),
}
