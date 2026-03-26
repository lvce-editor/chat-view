import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'

type ToolCallFileNameClickableProps = {
  readonly 'data-uri'?: string
  readonly onClick?: number
}

export const getToolCallFileNameDom = (fileName: string, fileNameClickableProps: ToolCallFileNameClickableProps = {}): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: ClassNames.ChatToolCallFileName,
      ...fileNameClickableProps,
      type: VirtualDomElements.Span,
    },
    text(fileName),
  ]
}
