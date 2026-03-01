import { type VirtualDomNode, AriaRoles, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'

const clampToPercentage = (tokensUsed: number, tokensMax: number): number => {
  if (tokensMax <= 0) {
    return 0
  }
  const percentage = (tokensUsed / tokensMax) * 100
  return Math.max(0, Math.min(100, percentage))
}

export const getChatSendAreaDom = (
  composerValue: string,
  models: readonly ChatModel[],
  selectedModelId: string,
  usageOverviewEnabled: boolean,
  tokensUsed: number,
  tokensMax: number,
): readonly VirtualDomNode[] => {
  const isSendDisabled = composerValue.trim() === ''
  const sendButtonClassName = isSendDisabled
    ? `${ClassNames.Button} ${ClassNames.ButtonPrimary} ${ClassNames.ButtonDisabled}`
    : `${ClassNames.Button} ${ClassNames.ButtonPrimary}`
  const usagePercent = clampToPercentage(tokensUsed, tokensMax)
  const usageLabel = `${tokensUsed} / ${tokensMax}`
  const usageTitle = `${tokensUsed} of ${tokensMax} tokens used (${Math.round(usagePercent)}%)`
  const modelOptions = models.flatMap((model) => {
    return [
      {
        childCount: 1,
        className: ClassNames.Option,
        selected: model.id === selectedModelId,
        type: VirtualDomElements.Option,
        value: model.id,
      },
      text(model.name),
    ]
  })
  return [
    {
      childCount: 1,
      className: ClassNames.ChatSendArea,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 2,
      className: ClassNames.ChatSendAreaContent,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: ClassNames.MultilineInputBox,
      name: 'composer',
      onInput: DomEventListenerFunctions.HandleInput,
      placeholder: Strings.composePlaceholder,
      rows: 4,
      type: VirtualDomElements.TextArea,
      value: composerValue,
    },
    {
      childCount: usageOverviewEnabled ? 3 : 2,
      className: ClassNames.ChatSendAreaBottom,
      type: VirtualDomElements.Div,
    },
    {
      childCount: models.length,
      className: ClassNames.Select,
      name: 'model',
      onInput: DomEventListenerFunctions.HandleModelChange,
      type: VirtualDomElements.Select,
      value: selectedModelId,
    },
    ...modelOptions,
    ...(usageOverviewEnabled
      ? [
          {
            childCount: 3,
            className: ClassNames.TokenUsageOverview,
            type: VirtualDomElements.Div,
          },
          {
            childCount: 1,
            className: ClassNames.TokenUsageRing,
            style: `background: conic-gradient(var(--vscode-button-background) ${usagePercent}%, var(--vscode-editorWidget-border) 0);`,
            title: usageTitle,
            type: VirtualDomElements.Div,
          },
          {
            childCount: 0,
            className: ClassNames.TokenUsageRingInner,
            style: 'background: var(--vscode-editor-background);',
            type: VirtualDomElements.Div,
          },
          {
            childCount: 1,
            className: ClassNames.LabelDetail,
            title: usageTitle,
            type: VirtualDomElements.Span,
          },
          text(usageLabel),
        ]
      : []),
    {
      childCount: 1,
      className: sendButtonClassName,
      disabled: isSendDisabled,
      name: 'send',
      onClick: DomEventListenerFunctions.HandleSubmit,
      role: AriaRoles.Button,
      title: Strings.sendMessage,
      type: VirtualDomElements.Button,
    },
    text(Strings.send),
  ]
}

export const getChatDetailsDom = (
  selectedSessionTitle: string,
  messagesNodes: readonly VirtualDomNode[],
  composerValue: string,
  models: readonly ChatModel[],
  selectedModelId: string,
  usageOverviewEnabled: boolean,
  tokensUsed: number,
  tokensMax: number,
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

    ...getChatSendAreaDom(composerValue, models, selectedModelId, usageOverviewEnabled, tokensUsed, tokensMax),
  ]
}
