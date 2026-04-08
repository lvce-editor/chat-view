import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { MessageHeadingNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'
import { getInlineNodeDom } from '../GetInlineNodeDom/GetInlineNodeDom.ts'
import { getHeadingElementType } from './GetHeadingElementType.ts'

export const getHeadingDom = (node: MessageHeadingNode, useChatMathWorker: boolean): readonly VirtualDomNode[] => {
  return [
    {
      childCount: node.children.length,
      type: getHeadingElementType(node.level),
    },
    ...node.children.flatMap((child) => getInlineNodeDom(child, useChatMathWorker)),
  ]
}
