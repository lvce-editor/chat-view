import { type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ChatModel } from '../ChatModel/ChatModel.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getChatSelectVirtualDom } from '../GetChatSelectVirtualDom/GetChatSelectVirtualDom.ts'
import * as Strings from '../GetChatViewDomStrings/GetChatViewDomStrings.ts'
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
  composerHeight = 28,
  composerFontSize = 13,
  composerFontFamily = 'system-ui',
  composerLineHeight = 20,
  composerDropActive = false,
): readonly VirtualDomNode[] => {
  const isSendDisabled = composerValue.trim() === ''
  return [
    {
      childCount: 1,
      className: ClassNames.ChatSendArea,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 3,
      className: ClassNames.ChatSendAreaContent,
      type: VirtualDomElements.Div,
    },
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
      childCount: 0,
      className: mergeClassNames(
        ClassNames.ChatSendAreaDropTarget,
        composerDropActive ? ClassNames.ChatSendAreaDropTargetActive : ClassNames.Empty,
      ),
      name: InputName.ComposerDropTarget,
      onDragEnter: DomEventListenerFunctions.HandleDragEnter,
      onDragLeave: DomEventListenerFunctions.HandleDragLeave,
      onDragOver: DomEventListenerFunctions.HandleDragOver,
      onDrop: DomEventListenerFunctions.HandleDrop,
      type: VirtualDomElements.Div,
    },
    {
      childCount: usageOverviewEnabled ? 3 : 2,
      className: ClassNames.ChatSendAreaBottom,
      type: VirtualDomElements.Div,
    },
    ...getChatSelectVirtualDom(models, selectedModelId),
    ...(usageOverviewEnabled ? getUsageOverviewDom(tokensUsed, tokensMax) : []),
    ...getSendButtonDom(isSendDisabled),
  ]
}
