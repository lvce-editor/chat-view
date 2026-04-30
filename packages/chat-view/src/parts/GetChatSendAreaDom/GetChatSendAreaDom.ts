/* cspell:ignore sonarjs */

/* eslint-disable sonarjs/cognitive-complexity */

import { AriaRoles, type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { AgentMode } from '../AgentMode/AgentMode.ts'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import type { ComposerAttachment } from '../ComposerAttachment/ComposerAttachment.ts'
import type { ComposerPrimaryControl } from '../ComposerPrimaryControls/ComposerPrimaryControls.ts'
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
import { getImplementPlanButtonDom } from '../GetImplementPlanButtonDom/GetImplementPlanButtonDom.ts'
import { getPrimaryControlsOverflowButtonDom } from '../GetPrimaryControlsOverflowButtonDom/GetPrimaryControlsOverflowButtonDom.ts'
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
  visiblePrimaryControls: readonly ComposerPrimaryControl[],
  hiddenPrimaryControls: readonly ComposerPrimaryControl[],
  primaryControlsOverflowButtonVisible: boolean,
  selectChevronEnabled: boolean,
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
  showImplementPlanButton = false,
  voiceDictationEnabled = false,
  isSessionInProgress = false,
  scrollDownButtonEnabled = false,
  messagesAutoScrollEnabled = true,
): readonly VirtualDomNode[] => {
  const isSendDisabled = composerValue.trim() === ''
  const showAgentModePicker = visiblePrimaryControls.includes('agent-mode-picker-toggle')
  const showModelPicker = visiblePrimaryControls.includes('model-picker-toggle')
  const showReasoningEffortPicker = visiblePrimaryControls.includes('reasoning-effort-picker-toggle')
  const showGitBranchPicker = gitBranchPickerVisible || Boolean(fallbackBranchName)
  const showResponsiveRunModePicker = visiblePrimaryControls.includes('run-mode-picker-toggle')
  const showScrollDownButton = scrollDownButtonEnabled && !messagesAutoScrollEnabled
  const bottomControlsCount =
    2 +
    (usageOverviewEnabled ? 1 : 0) +
    (addContextButtonEnabled ? 1 : 0) +
    (showCreatePullRequestButton ? 1 : 0) +
    (showImplementPlanButton ? 1 : 0) +
    (showGitBranchPicker ? 1 : 0) +
    (voiceDictationEnabled ? 1 : 0) +
    (showScrollDownButton ? 1 : 0)
  const primaryControlsCount =
    (showAgentModePicker ? 1 : 0) +
    (showModelPicker ? 1 : 0) +
    (showReasoningEffortPicker ? 1 : 0) +
    (showResponsiveRunModePicker ? 1 : 0) +
    (primaryControlsOverflowButtonVisible && hiddenPrimaryControls.length > 0 ? 1 : 0)
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
    {
      childCount: 1,
      className: ClassNames.ChatSendAreaContentTop,
      type: VirtualDomElements.Div,
    },
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
      role: AriaRoles.ToolBar,
      type: VirtualDomElements.Div,
    },
    ...(showAgentModePicker ? getAgentModePickerVirtualDom(agentMode, agentModePickerOpen, selectChevronEnabled) : []),
    ...(showModelPicker ? getChatModelPickerToggleVirtualDom(models, selectedModelId, modelPickerOpen, selectChevronEnabled) : []),
    ...(showReasoningEffortPicker ? getReasoningEffortPickerVirtualDom(reasoningEffort, reasoningEffortPickerOpen, selectChevronEnabled) : []),
    ...(showResponsiveRunModePicker ? getRunModePickerVirtualDom(runMode, runModePickerOpen, selectChevronEnabled) : []),
    ...(primaryControlsOverflowButtonVisible && hiddenPrimaryControls.length > 0 ? getPrimaryControlsOverflowButtonDom() : []),
    ...(usageOverviewEnabled ? getUsageOverviewDom(tokensUsed, tokensMax) : []),
    ...(addContextButtonEnabled ? getAddContextButtonDom() : []),
    ...(showCreatePullRequestButton ? getCreatePullRequestButtonDom() : []),
    ...(showImplementPlanButton ? getImplementPlanButtonDom() : []),
    ...(showGitBranchPicker
      ? getGitBranchPickerVirtualDom(gitBranches, gitBranchPickerOpen, gitBranchPickerErrorMessage, fallbackBranchName, selectChevronEnabled)
      : []),
    ...(showScrollDownButton ? getScrollDownButtonDom() : []),
    ...getSendButtonDom(isSendDisabled, voiceDictationEnabled, isSessionInProgress),
  ]
}
