import { type VirtualDomNode, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import type { RunMode } from '../RunMode/RunMode.ts'
import type { TodoListItem } from '../TodoListItem/TodoListItem.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getChatSelectVirtualDom } from '../GetChatSelectVirtualDom/GetChatSelectVirtualDom.ts'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'
import { getRunModeSelectVirtualDom } from '../GetRunModeSelectVirtualDom/GetRunModeSelectVirtualDom.ts'
import { getSendButtonDom } from '../GetSendButtonDom/GetSendButtonDom.ts'
import { getUsageOverviewDom } from '../GetUsageOverviewDom/GetUsageOverviewDom.ts'
import * as InputName from '../InputName/InputName.ts'

export const getChatSendAreaDom = (
  composerValue: string,
  models: readonly ChatModel[],
  selectedModelId: string,
  usageOverviewEnabled: boolean,
  tokensUsed: number,
  tokensMax: number,
  showRunMode: boolean,
  runMode: RunMode,
  todoListToolEnabled: boolean,
  todoListItems: readonly TodoListItem[],
  voiceDictationEnabled = false,
): readonly VirtualDomNode[] => {
  const isSendDisabled = composerValue.trim() === ''
  const controlsCount = 2 + (usageOverviewEnabled ? 1 : 0) + (showRunMode ? 1 : 0)
  const hasTodoList = todoListToolEnabled && todoListItems.length > 0
  const todoHeaderText = `Todos (${todoListItems.filter((item) => item.status === 'completed').length}/${todoListItems.length})`
  const getTodoItemClassName = (status: TodoListItem['status']): string => {
    if (status === 'completed') {
      return `${ClassNames.ChatTodoListItem} ${ClassNames.ChatTodoListItemCompleted} completed`
    }
    if (status === 'inProgress') {
      return `${ClassNames.ChatTodoListItem} ${ClassNames.ChatTodoListItemInProgress} inProgress`
    }
    return `${ClassNames.ChatTodoListItem} ${ClassNames.ChatTodoListItemTodo} todo`
  }
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
    ...(hasTodoList
      ? [
          {
            childCount: 2,
            className: ClassNames.ChatTodoList,
            type: VirtualDomElements.Div,
          },
          {
            childCount: 1,
            className: ClassNames.ChatTodoListHeader,
            type: VirtualDomElements.Div,
          },
          {
            ...text(todoHeaderText),
          },
          {
            childCount: todoListItems.length,
            className: ClassNames.ChatTodoListItems,
            type: VirtualDomElements.Ul,
          },
          ...todoListItems.flatMap((item) => [
            {
              childCount: 1,
              className: getTodoItemClassName(item.status),
              type: VirtualDomElements.Li,
            },
            text(item.text),
          ]),
        ]
      : []),
    {
      childCount: 0,
      className: ClassNames.MultilineInputBox,
      name: InputName.Composer,
      onFocus: DomEventListenerFunctions.HandleFocus,
      onInput: DomEventListenerFunctions.HandleInput,
      placeholder: Strings.composePlaceholder(),
      type: VirtualDomElements.TextArea,
      value: composerValue,
    },
    {
      childCount: voiceDictationEnabled ? controlsCount + 1 : controlsCount,
      className: ClassNames.ChatSendAreaBottom,
      type: VirtualDomElements.Div,
    },
    ...getChatSelectVirtualDom(models, selectedModelId),
    ...(showRunMode ? getRunModeSelectVirtualDom(runMode) : []),
    ...(usageOverviewEnabled ? getUsageOverviewDom(tokensUsed, tokensMax) : []),
    ...getSendButtonDom(isSendDisabled, voiceDictationEnabled),
  ]
}
