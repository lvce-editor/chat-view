import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { AgentMode } from '../AgentMode/AgentMode.ts'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import type { ComposerAttachment } from '../ComposerAttachment/ComposerAttachment.ts'
import type { GitBranch } from '../GitBranch/GitBranch.ts'
import type { ReasoningEffort } from '../ReasoningEffort/ReasoningEffort.ts'
import type { RunMode } from '../RunMode/RunMode.ts'
import type { TodoListItem } from '../TodoListItem/TodoListItem.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getAddContextButtonDom } from '../GetAddContextButtonDom/GetAddContextButtonDom.ts'
import { getAgentModePickerVirtualDom } from '../GetAgentModePickerVirtualDom/GetAgentModePickerVirtualDom.ts'
import { getChatModelPickerToggleVirtualDom } from '../GetChatModelPickerToggleVirtualDom/GetChatModelPickerToggleVirtualDom.ts'
import { getCreatePullRequestButtonDom } from '../GetCreatePullRequestButtonDom/GetCreatePullRequestButtonDom.ts'
import { getGitBranchPickerVirtualDom } from '../GetGitBranchPickerVirtualDom/GetGitBranchPickerVirtualDom.ts'
import { getReasoningEffortPickerVirtualDom } from '../GetReasoningEffortPickerVirtualDom/GetReasoningEffortPickerVirtualDom.ts'
import { getRunModePickerVirtualDom } from '../GetRunModePickerVirtualDom/GetRunModePickerVirtualDom.ts'
import { getScrollDownButtonDom } from '../GetScrollDownButtonDom/GetScrollDownButtonDom.ts'
import { getSendButtonDom } from '../GetSendButtonDom/GetSendButtonDom.ts'
import { getTodoListDom } from '../GetTodoListDom/GetTodoListDom.ts'
import { getUsageOverviewDom } from '../GetUsageOverviewDom/GetUsageOverviewDom.ts'
import { getComposerAttachmentsDom } from './GetComposerAttachmentsDom/GetComposerAttachmentsDom.ts'
import { getComposerTextAreaDom } from './GetComposerTextAreaDom/GetComposerTextAreaDom.ts'

export const getChatSendAreaDom = (
  composerValue: string,
  composerAttachments: readonly ComposerAttachment[],
  agentMode: AgentMode,
  agentModePickerOpen: boolean,
  gitBranchPickerVisible: boolean,
  gitBranchPickerOpen: boolean,
  gitBranchPickerErrorMessage: string,
  gitBranches: readonly GitBranch[],
  fallbackBranchName: string,
  hasSpaceForAgentModePicker: boolean,
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
  hasSpaceForRunModePicker: boolean,
  runMode: RunMode,
  runModePickerOpen: boolean,
  todoListToolEnabled: boolean,
  todoListItems: readonly TodoListItem[],
  showCreatePullRequestButton = false,
  voiceDictationEnabled = false,
  isSessionInProgress = false,
  scrollDownButtonEnabled = false,
  messagesAutoScrollEnabled = true,
): readonly VirtualDomNode[] => {
  const isSendDisabled = composerValue.trim() === ''
  const showAgentModePicker = hasSpaceForAgentModePicker
  const showGitBranchPicker = gitBranchPickerVisible || Boolean(fallbackBranchName)
  const showResponsiveRunModePicker = showRunMode && hasSpaceForRunModePicker
  const showScrollDownButton = scrollDownButtonEnabled && !messagesAutoScrollEnabled
  const bottomControlsCount =
    2 +
    (usageOverviewEnabled ? 1 : 0) +
    (addContextButtonEnabled ? 1 : 0) +
    (showCreatePullRequestButton ? 1 : 0) +
    (showGitBranchPicker ? 1 : 0) +
    (voiceDictationEnabled ? 1 : 0) +
    (showScrollDownButton ? 1 : 0)
  const primaryControlsCount = 1 + (showAgentModePicker ? 1 : 0) + (reasoningPickerEnabled ? 1 : 0) + (showResponsiveRunModePicker ? 1 : 0)
  const hasTodoList = todoListToolEnabled && todoListItems.length > 0
  const hasComposerAttachments = composerAttachments.length > 0

  return [
    {
      childCount: 1,
      className: ClassNames.ChatSendArea,
      onContextMenu: DomEventListenerFunctions.HandleContextMenuChatSendAreaBottom,
      onSubmit: DomEventListenerFunctions.HandleSubmit,
      type: VirtualDomElements.Form,
    },
    {
      childCount: 2 + (hasTodoList ? 1 : 0) + (hasComposerAttachments ? 1 : 0),
      className: ClassNames.ChatSendAreaContent,
      type: VirtualDomElements.Div,
    },
    ...getTodoListDom(hasTodoList, todoListItems),
    ...getComposerAttachmentsDom(composerAttachments),
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
      role: 'toolbar',
      type: VirtualDomElements.Div,
    },
    ...(showAgentModePicker ? getAgentModePickerVirtualDom(agentMode, agentModePickerOpen) : []),
    ...getChatModelPickerToggleVirtualDom(models, selectedModelId, modelPickerOpen),
    ...(reasoningPickerEnabled ? getReasoningEffortPickerVirtualDom(reasoningEffort, reasoningEffortPickerOpen) : []),
    ...(showResponsiveRunModePicker ? getRunModePickerVirtualDom(runMode, runModePickerOpen) : []),
    ...(usageOverviewEnabled ? getUsageOverviewDom(tokensUsed, tokensMax) : []),
    ...(addContextButtonEnabled ? getAddContextButtonDom() : []),
    ...(showCreatePullRequestButton ? getCreatePullRequestButtonDom() : []),
    ...(showGitBranchPicker ? getGitBranchPickerVirtualDom(gitBranches, gitBranchPickerOpen, gitBranchPickerErrorMessage, fallbackBranchName) : []),
    ...(showScrollDownButton ? getScrollDownButtonDom() : []),
    ...getSendButtonDom(isSendDisabled, voiceDictationEnabled, isSessionInProgress),
  ]
}
