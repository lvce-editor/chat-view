import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { MessageInlineNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'

 
export interface InlineNodeDomRenderer {
  (inlineNode: MessageInlineNode, useChatMathWorker: boolean): readonly VirtualDomNode[]
}
