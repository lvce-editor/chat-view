import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'

type ToolCallFileNameClickableProps = {
  readonly 'data-uri'?: string
  readonly onClick?: number
}

type GetToolCallFileNameDomOptions = {
  readonly clickableProps?: ToolCallFileNameClickableProps
  readonly title?: string
}

export const getToolCallFileNameDom = (
  fileName: string,
  { clickableProps = {}, title }: GetToolCallFileNameDomOptions = {},
): readonly VirtualDomNode[] => {
  const resolvedTitle = title ?? clickableProps['data-uri']
  return [
    {
      childCount: 1,
      className: ClassNames.ChatToolCallReadFileLink,
      ...(resolvedTitle === undefined ? {} : { title: resolvedTitle }),
      ...clickableProps,
      type: VirtualDomElements.Span,
    },
    {
      childCount: 1,
      className: ClassNames.ChatToolCallFileName,
      ...clickableProps,
      type: VirtualDomElements.Span,
    },
    text(fileName),
  ]
}
