import { type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import type { RunMode } from '../RunMode/RunMode.ts'
import type { TodoListItem } from '../TodoListItem/TodoListItem.ts'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getAddContextButtonDom } from '../GetAddContextButtonDom/GetAddContextButtonDom.ts'
import { getChatModelPickerToggleVirtualDom } from '../GetChatModelPickerToggleVirtualDom/GetChatModelPickerToggleVirtualDom.ts'
import { getRunModeSelectVirtualDom } from '../GetRunModeSelectVirtualDom/GetRunModeSelectVirtualDom.ts'
import { getSendButtonDom } from '../GetSendButtonDom/GetSendButtonDom.ts'
import { getTodoListDom } from '../GetTodoListDom/GetTodoListDom.ts'
import { getUsageOverviewDom } from '../GetUsageOverviewDom/GetUsageOverviewDom.ts'
import * as InputName from '../InputName/InputName.ts'

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const getChatSendAreaDom = (
  composerValue: string,
  modelPickerOpen: boolean,
  models: readonly ChatModel[],
  selectedModelId: string,
  usageOverviewEnabled: boolean,
  tokensUsed: number,
  tokensMax: number,
  addContextButtonEnabled: boolean,
  showRunMode: boolean,
  runMode: RunMode,
  todoListToolEnabled: boolean,
  todoListItems: readonly TodoListItem[],
  voiceDictationEnabled = false,
): readonly VirtualDomNode[] => {
  const isSendDisabled = composerValue.trim() === ''
  const controlsCount = 2 + (usageOverviewEnabled ? 1 : 0) + (showRunMode ? 1 : 0) + (addContextButtonEnabled ? 1 : 0)
  const hasTodoList = todoListToolEnabled && todoListItems.length > 0

  return [
    {
      childCount: 1,
      className: ClassNames.ChatSendArea,
      onSubmit: DomEventListenerFunctions.HandleSubmit,
      type: VirtualDomElements.Form,
    },
    {
      childCount: hasTodoList ? 3 : 2,
      className: ClassNames.ChatSendAreaContent,
      type: VirtualDomElements.Div,
    },
    ...getTodoListDom(hasTodoList, todoListItems),
    {
      childCount: 0,
      className: mergeClassNames(ClassNames.MultiLineInputBox, ClassNames.ChatInputBox),
      name: InputName.Composer,
      onContextMenu: DomEventListenerFunctions.HandleChatInputContextMenu,
      onFocus: DomEventListenerFunctions.HandleFocus,
      onInput: DomEventListenerFunctions.HandleInput,
      placeholder: Strings.composePlaceholder(),
      type: VirtualDomElements.TextArea,
    },
    {
      childCount: voiceDictationEnabled ? controlsCount + 1 : controlsCount,
      className: ClassNames.ChatSendAreaBottom,
      onContextMenu: DomEventListenerFunctions.HandleContextMenuChatSendAreaBottom,
      type: VirtualDomElements.Div,
    },
    ...getChatModelPickerToggleVirtualDom(models, selectedModelId, modelPickerOpen),
    ...(showRunMode ? getRunModeSelectVirtualDom(runMode) : []),
    ...(usageOverviewEnabled ? getUsageOverviewDom(tokensUsed, tokensMax) : []),
    ...(addContextButtonEnabled ? getAddContextButtonDom() : []),
    ...getSendButtonDom(isSendDisabled, voiceDictationEnabled),
  ]
}
