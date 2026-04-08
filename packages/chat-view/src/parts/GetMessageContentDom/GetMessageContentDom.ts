import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { MessageIntermediateNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'
import { getMessageNodeDom } from '../GetMessageNodeDom/GetMessageNodeDom.ts'

export const getMessageContentDom = (nodes: readonly MessageIntermediateNode[], useChatMathWorker = false): readonly VirtualDomNode[] => {
  return nodes.flatMap((node) => getMessageNodeDom(node, useChatMathWorker))
}
