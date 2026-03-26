import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import type { ReasoningEffort } from '../ReasoningEffort/ReasoningEffort.ts'
import type { RunMode } from '../RunMode/RunMode.ts'
import type { TodoListItem } from '../TodoListItem/TodoListItem.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getChatSendAreaDom } from '../GetChatSendAreaDom/GetChatSendAreaDom.ts'

export const getChatDetailsDom = (
  selectedSessionTitle: string,
  messagesNodes: readonly VirtualDomNode[],
  composerValue: string,
  modelPickerOpen: boolean,
  models: readonly ChatModel[],
  selectedModelId: string,
  reasoningPickerEnabled: boolean,
  reasoningEffort: ReasoningEffort,
  reasoningEffortPickerOpen: boolean,
  usageOverviewEnabled: boolean,
  tokensUsed: number,
  tokensMax: number,
  addContextButtonEnabled: boolean,
  showRunMode: boolean,
  runMode: RunMode,
  runModePickerOpen: boolean,
  todoListToolEnabled: boolean,
  todoListItems: readonly TodoListItem[],
  showCreatePullRequestButton = false,
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
      [],
      modelPickerOpen,
      models,
      selectedModelId,
      reasoningPickerEnabled,
      reasoningEffort,
      reasoningEffortPickerOpen,
      usageOverviewEnabled,
      tokensUsed,
      tokensMax,
      addContextButtonEnabled,
      showRunMode,
      runMode,
      runModePickerOpen,
      todoListToolEnabled,
      todoListItems,
      showCreatePullRequestButton,
    ),
  ]
}
