import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import type { RunMode } from '../RunMode/RunMode.ts'
import type { TodoListItem } from '../TodoListItem/TodoListItem.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getChatSendAreaDom } from '../GetChatSendAreaDom/GetChatSendAreaDom.ts'

export const getChatDetailsDom = (
  selectedSessionTitle: string,
  messagesNodes: readonly VirtualDomNode[],
  composerValue: string,
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
): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 3,
      className: ClassNames.ChatDetails,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.Label,
      type: VirtualDomElements.Span,
    },
    text(selectedSessionTitle),
    ...getChatSendAreaDom(
      composerValue,
      models,
      selectedModelId,
      usageOverviewEnabled,
      tokensUsed,
      tokensMax,
      addContextButtonEnabled,
      showRunMode,
      runMode,
      todoListToolEnabled,
      todoListItems,
    ),
  ]
}
