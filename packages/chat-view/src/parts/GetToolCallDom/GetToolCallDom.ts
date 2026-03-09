import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getToolCallArgumentPreview } from '../GetToolCallArgumentPreview/GetToolCallArgumentPreview.ts'

const getReadFileUri = (rawArguments: string): string => {
  let parsed: unknown
  try {
    parsed = JSON.parse(rawArguments)
  } catch {
    return ''
  }
  if (!parsed || typeof parsed !== 'object') {
    return ''
  }
  const uri = Reflect.get(parsed, 'uri')
  return typeof uri === 'string' ? uri : ''
}

const getFileNameFromUri = (uri: string): string => {
  const stripped = uri.replace(/[?#].*$/, '').replace(/\/$/, '')
  const slashIndex = Math.max(stripped.lastIndexOf('/'), stripped.lastIndexOf('\\\\'))
  const fileName = slashIndex === -1 ? stripped : stripped.slice(slashIndex + 1)
  return fileName || uri
}

export const getToolCallDom = (toolCall: { readonly name: string; readonly arguments: string }): readonly VirtualDomNode[] => {
  if (toolCall.name === 'read_file') {
    const uri = getReadFileUri(toolCall.arguments)
    if (uri) {
      const fileName = getFileNameFromUri(uri)
      return [
        {
          childCount: 2,
          className: ClassNames.ChatOrderedListItem,
          'data-uri': uri,
          onClick: DomEventListenerFunctions.HandleClickReadFile,
          title: uri,
          type: VirtualDomElements.Li,
        },
        {
          childCount: 0,
          className: ClassNames.FileIcon,
          'data-uri': uri,
          type: VirtualDomElements.Div,
        },
        {
          childCount: 1,
          'data-uri': uri,
          type: VirtualDomElements.Span,
        },
        text(fileName),
      ]
    }
  }

  const argumentPreview = getToolCallArgumentPreview(toolCall.arguments)
  const label = `${toolCall.name} ${argumentPreview}`
  return [
    {
      childCount: 1,
      className: ClassNames.ChatOrderedListItem,
      type: VirtualDomElements.Li,
    },
    text(label),
  ]
}
