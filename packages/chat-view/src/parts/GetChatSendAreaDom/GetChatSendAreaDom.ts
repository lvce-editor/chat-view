import { type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import type { RunMode } from '../RunMode/RunMode.ts'
import type { TodoListItem } from '../TodoListItem/TodoListItem.ts'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getAddContextButtonDom } from '../GetAddContextButtonDom/GetAddContextButtonDom.ts'
import { getChatModelPickerToggleVirtualDom } from '../GetChatModelPickerToggleVirtualDom/GetChatModelPickerToggleVirtualDom.ts'
import { getRunModePickerVirtualDom } from '../GetRunModePickerVirtualDom/GetRunModePickerVirtualDom.ts'
import { getSendButtonDom } from '../GetSendButtonDom/GetSendButtonDom.ts'
import { getTodoListDom } from '../GetTodoListDom/GetTodoListDom.ts'
import { getUsageOverviewDom } from '../GetUsageOverviewDom/GetUsageOverviewDom.ts'
import * as InputName from '../InputName/InputName.ts'

const getComposerTextAreaDom = (): VirtualDomNode => {
  return {
    childCount: 0,
    className: mergeClassNames(ClassNames.MultiLineInputBox, ClassNames.ChatInputBox),
    name: InputName.Composer,
    onContextMenu: DomEventListenerFunctions.HandleChatInputContextMenu,
    onFocus: DomEventListenerFunctions.HandleFocus,
    onInput: DomEventListenerFunctions.HandleInput,
    onSelectionChange: DomEventListenerFunctions.HandleComposerSelectionChange,
    placeholder: Strings.composePlaceholder(),
    spellcheck: false,
    type: VirtualDomElements.TextArea,
  }
}

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
  runModePickerOpen: boolean,
  todoListToolEnabled: boolean,
  todoListItems: readonly TodoListItem[],
  voiceDictationEnabled = false,
): readonly VirtualDomNode[] => {
  const isSendDisabled = composerValue.trim() === ''
  const bottomControlsCount = 2 + (usageOverviewEnabled ? 1 : 0) + (addContextButtonEnabled ? 1 : 0) + (voiceDictationEnabled ? 1 : 0)
  const primaryControlsCount = 1 + (showRunMode ? 1 : 0)
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
    getComposerTextAreaDom(),
    {
      childCount: bottomControlsCount,
      className: ClassNames.ChatSendAreaBottom,
      onContextMenu: DomEventListenerFunctions.HandleContextMenuChatSendAreaBottom,
      type: VirtualDomElements.Div,
    },
    {
      childCount: primaryControlsCount,
      className: ClassNames.ChatSendAreaPrimaryControls,
      type: VirtualDomElements.Div,
    },
    ...getChatModelPickerToggleVirtualDom(models, selectedModelId, modelPickerOpen),
    ...(showRunMode ? getRunModePickerVirtualDom(runMode, runModePickerOpen) : []),
    ...(usageOverviewEnabled ? getUsageOverviewDom(tokensUsed, tokensMax) : []),
    ...(addContextButtonEnabled ? getAddContextButtonDom() : []),
    ...getSendButtonDom(isSendDisabled, voiceDictationEnabled),
  ]
}
