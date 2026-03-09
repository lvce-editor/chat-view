import { type VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { getMessageNodeDom } from '../GetMessageNodeDom/GetMessageNodeDom.ts'
import type { MessageIntermediateNode } from '../ParseMessageContentTypes.ts'

export const getMessageContentDom = (nodes: readonly MessageIntermediateNode[]): readonly VirtualDomNode[] => {
  return nodes.flatMap(getMessageNodeDom)
}
