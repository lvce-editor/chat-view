import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { MessageInlineNode } from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export type InlineNodeDomRenderer = (inlineNode: MessageInlineNode, useChatMathWorker: boolean) => readonly VirtualDomNode[]
