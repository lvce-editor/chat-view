import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel } from '../../ChatModel/ChatModel.ts'
import * as ClassNames from '../../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as Strings from '../../GetChatViewDomStrings/GetChatViewDomStrings.ts'
import { getModelOptionDOm } from '../GetModelOptionDom/GetModelOptionDom.ts'
import { getSendButtonDom } from '../GetSendButtonDom/GetSendButtonDom.ts'
import { getUsageOverviewDom } from '../GetUsageOverviewDom/GetUsageOverviewDom.ts'

export const getChatSendAreaDom = (
  composerValue: string,
  models: readonly ChatModel[],
  selectedModelId: string,
  usageOverviewEnabled: boolean,
  tokensUsed: number,
  tokensMax: number,
): readonly VirtualDomNode[] => {
  const isSendDisabled = composerValue.trim() === ''
  const modelOptions = models.flatMap((model) => getModelOptionDOm(model, selectedModelId))
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
    ...(usageOverviewEnabled ? getUsageOverviewDom(tokensUsed, tokensMax) : []),
    ...getSendButtonDom(isSendDisabled),
  ]
}
