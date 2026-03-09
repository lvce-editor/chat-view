import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getFileNameFromUri } from './GetFileNameFromUri.ts'
import { getReadFileTarget } from './GetReadFileTarget.ts'

export const getToolCallReadFileVirtualDom = (toolCall: { readonly name: string; readonly arguments: string }): readonly VirtualDomNode[] => {
  const target = getReadFileTarget(toolCall.arguments)
  if (!target) {
    return []
  }
  const fileName = getFileNameFromUri(target.title)
  const clickableProps = target.clickableUri
    ? {
        'data-uri': target.clickableUri,
        onClick: DomEventListenerFunctions.HandleClickReadFile,
      }
    : {}
  const fileNameClickableProps = target.clickableUri
    ? {
        'data-uri': target.clickableUri,
        onClick: DomEventListenerFunctions.HandleClickReadFile,
      }
    : {}
  return [
    {
      childCount: 2,
      className: ClassNames.ChatOrderedListItem,
      ...clickableProps,
      title: target.title,
      type: VirtualDomElements.Li,
    },
    {
      childCount: 0,
      className: ClassNames.FileIcon,
      ...clickableProps,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      ...fileNameClickableProps,
      style: 'color: var(--vscode-textLink-foreground); text-decoration: underline;',
      type: VirtualDomElements.Span,
    },
    text(fileName),
  ]
}
