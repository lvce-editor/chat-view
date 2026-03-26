import { type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import type { ComposerAttachment, ComposerAttachmentDisplayType } from '../ComposerAttachment/ComposerAttachment.ts'
import type { ReasoningEffort } from '../ReasoningEffort/ReasoningEffort.ts'
import type { RunMode } from '../RunMode/RunMode.ts'
import type { TodoListItem } from '../TodoListItem/TodoListItem.ts'
import * as Strings from '../ChatStrings/ChatStrings.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getAddContextButtonDom } from '../GetAddContextButtonDom/GetAddContextButtonDom.ts'
import { getChatModelPickerToggleVirtualDom } from '../GetChatModelPickerToggleVirtualDom/GetChatModelPickerToggleVirtualDom.ts'
import { getCreatePullRequestButtonDom } from '../GetCreatePullRequestButtonDom/GetCreatePullRequestButtonDom.ts'
import { getReasoningEffortPickerVirtualDom } from '../GetReasoningEffortPickerVirtualDom/GetReasoningEffortPickerVirtualDom.ts'
import { getRunModePickerVirtualDom } from '../GetRunModePickerVirtualDom/GetRunModePickerVirtualDom.ts'
import { getSendButtonDom } from '../GetSendButtonDom/GetSendButtonDom.ts'
import { getTodoListDom } from '../GetTodoListDom/GetTodoListDom.ts'
import { getUsageOverviewDom } from '../GetUsageOverviewDom/GetUsageOverviewDom.ts'
import * as InputName from '../InputName/InputName.ts'

const getComposerAttachmentLabel = (displayType: ComposerAttachmentDisplayType): string => {
  switch (displayType) {
    case 'file':
      return 'File'
    case 'image':
      return 'Image'
    case 'invalid-image':
      return 'Invalid image'
    case 'text-file':
      return 'Text file'
    default:
      return displayType
  }
}

const getComposerAttachmentClassName = (displayType: ComposerAttachmentDisplayType): string => {
  switch (displayType) {
    case 'file':
      return ClassNames.ChatComposerAttachment
    case 'image':
      return ClassNames.ChatComposerAttachmentImage
    case 'invalid-image':
      return ClassNames.ChatComposerAttachmentInvalidImage
    case 'text-file':
      return ClassNames.ChatComposerAttachmentTextFile
    default:
      return ClassNames.ChatComposerAttachment
  }
}

const getComposerAttachmentsDom = (composerAttachments: readonly ComposerAttachment[]): readonly VirtualDomNode[] => {
  if (composerAttachments.length === 0) {
    return []
  }
  return [
    {
      childCount: composerAttachments.length,
      className: ClassNames.ChatComposerAttachments,
      type: VirtualDomElements.Div,
    },
    ...composerAttachments.flatMap((attachment) => [
      {
        childCount: 1,
        className: mergeClassNames(ClassNames.ChatComposerAttachment, getComposerAttachmentClassName(attachment.displayType)),
        name: InputName.getComposerAttachmentInputName(attachment.attachmentId),
        type: VirtualDomElements.Div,
      },
      {
        text: `${getComposerAttachmentLabel(attachment.displayType)} · ${attachment.name}`,
        type: VirtualDomElements.Text,
      },
    ]),
  ]
}

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
  composerAttachments: readonly ComposerAttachment[],
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
  voiceDictationEnabled = false,
): readonly VirtualDomNode[] => {
  const isSendDisabled = composerValue.trim() === ''
  const bottomControlsCount =
    2 + (usageOverviewEnabled ? 1 : 0) + (addContextButtonEnabled ? 1 : 0) + (showCreatePullRequestButton ? 1 : 0) + (voiceDictationEnabled ? 1 : 0)
  const primaryControlsCount = 1 + (reasoningPickerEnabled ? 1 : 0) + (showRunMode ? 1 : 0)
  const hasTodoList = todoListToolEnabled && todoListItems.length > 0
  const hasComposerAttachments = composerAttachments.length > 0

  return [
    {
      childCount: 1,
      className: ClassNames.ChatSendArea,
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
      type: VirtualDomElements.Div,
    },
    ...getChatModelPickerToggleVirtualDom(models, selectedModelId, modelPickerOpen),
    ...(reasoningPickerEnabled ? getReasoningEffortPickerVirtualDom(reasoningEffort, reasoningEffortPickerOpen) : []),
    ...(showRunMode ? getRunModePickerVirtualDom(runMode, runModePickerOpen) : []),
    ...(usageOverviewEnabled ? getUsageOverviewDom(tokensUsed, tokensMax) : []),
    ...(addContextButtonEnabled ? getAddContextButtonDom() : []),
    ...(showCreatePullRequestButton ? getCreatePullRequestButtonDom() : []),
    ...getSendButtonDom(isSendDisabled, voiceDictationEnabled),
  ]
}
