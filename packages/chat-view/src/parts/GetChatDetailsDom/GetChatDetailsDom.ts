import { type VirtualDomNode, AriaRoles, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'

export const getChatSendAreaDom = (composerValue: string, models: readonly ChatModel[], selectedModelId: string): readonly VirtualDomNode[] => {
  const isSendDisabled = composerValue.trim() === ''
  const sendButtonClassName = isSendDisabled
    ? `${ClassNames.Button} ${ClassNames.ButtonPrimary} ${ClassNames.ButtonDisabled}`
    : `${ClassNames.Button} ${ClassNames.ButtonPrimary}`
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
      childCount: 2,
      className: ClassNames.ChatSendArea,
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
      childCount: 2,
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

    ...getChatSendAreaDom(composerValue, models, selectedModelId),
  ]
}
