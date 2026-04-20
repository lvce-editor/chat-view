import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type { ComposerAttachment } from '../ComposerAttachment/ComposerAttachment.ts'
import type {
  MessageInlineNode,
  MessageIntermediateNode,
  MessageListItemNode,
  MessageTableCellNode,
} from '../ParseMessageContentTypes/ParseMessageContentTypes.ts'

export interface ChatViewDomNode {
  readonly [key: string]: unknown
  readonly type: number
}

export type ChatViewContentNode =
  | ChatViewTextNode
  | ChatViewBlockQuoteNode
  | ChatViewHeadingNode
  | ChatViewOrderedListNode
  | ChatViewUnorderedListNode
  | ChatViewTableNode
  | ChatViewCodeBlockNode
  | ChatViewMathBlockNode
  | ChatViewThematicBreakNode
  | ChatViewMathBlockDomNode

export type ChatViewInlineNode =
  | ChatViewInlineTextNode
  | ChatViewInlineLinkNode
  | ChatViewInlineImageNode
  | ChatViewInlineBoldNode
  | ChatViewInlineItalicNode
  | ChatViewInlineStrikethroughNode
  | ChatViewInlineCodeNode
  | ChatViewMathInlineNode
  | ChatViewMathInlineDomNode

export interface ChatViewInlineTextNode {
  readonly text: string
  readonly type: 'text'
}

export interface ChatViewInlineLinkNode {
  readonly href: string
  readonly text: string
  readonly type: 'link'
}

export interface ChatViewInlineImageNode {
  readonly alt: string
  readonly src: string
  readonly type: 'image'
}

export interface ChatViewInlineBoldNode {
  readonly children: readonly ChatViewInlineNode[]
  readonly type: 'bold'
}

export interface ChatViewInlineItalicNode {
  readonly children: readonly ChatViewInlineNode[]
  readonly type: 'italic'
}

export interface ChatViewInlineStrikethroughNode {
  readonly children: readonly ChatViewInlineNode[]
  readonly type: 'strikethrough'
}

export interface ChatViewInlineCodeNode {
  readonly text: string
  readonly type: 'inline-code'
}

export interface ChatViewMathInlineNode {
  readonly displayMode: boolean
  readonly text: string
  readonly type: 'math-inline'
}

export interface ChatViewMathInlineDomNode {
  readonly dom: readonly ChatViewDomNode[]
  readonly type: 'math-inline-dom'
}

export interface ChatViewTextNode {
  readonly children: readonly ChatViewInlineNode[]
  readonly type: 'text'
}

export interface ChatViewHeadingNode {
  readonly children: readonly ChatViewInlineNode[]
  readonly level: 1 | 2 | 3 | 4 | 5 | 6
  readonly type: 'heading'
}

export interface ChatViewBlockQuoteNode {
  readonly children: readonly ChatViewContentNode[]
  readonly type: 'blockquote'
}

export interface ChatViewOrderedListNode {
  readonly items: readonly ChatViewListItemNode[]
  readonly type: 'ordered-list'
}

export interface ChatViewUnorderedListNode {
  readonly items: readonly ChatViewListItemNode[]
  readonly type: 'unordered-list'
}

export interface ChatViewListItemNode {
  readonly children: readonly ChatViewInlineNode[]
  readonly index?: number
  readonly nestedItems?: readonly ChatViewListItemNode[]
  readonly nestedListType?: 'ordered-list' | 'unordered-list'
  readonly type: 'list-item'
}

export interface ChatViewTableNode {
  readonly headers: readonly ChatViewTableCellNode[]
  readonly rows: readonly ChatViewTableRowNode[]
  readonly type: 'table'
}

export interface ChatViewTableCellNode {
  readonly children: readonly ChatViewInlineNode[]
  readonly type: 'table-cell'
}

export interface ChatViewTableRowNode {
  readonly cells: readonly ChatViewTableCellNode[]
  readonly type: 'table-row'
}

export interface ChatViewCodeBlockNode {
  readonly language?: string
  readonly text: string
  readonly type: 'code-block'
}

export interface ChatViewMathBlockNode {
  readonly text: string
  readonly type: 'math-block'
}

export interface ChatViewThematicBreakNode {
  readonly type: 'thematic-break'
}

export interface ChatViewMathBlockDomNode {
  readonly dom: readonly ChatViewDomNode[]
  readonly type: 'math-block-dom'
}

export interface ChatViewItem {
  readonly message: ChatMessage
  readonly parsedContent: readonly ChatViewContentNode[]
  readonly standaloneImageAttachment?: ComposerAttachment
}

export interface ChatViewModel {
  readonly items: readonly ChatViewItem[]
  readonly sessionId: string
}

const toVirtualDomNodes = (nodes: readonly ChatViewDomNode[]): readonly VirtualDomNode[] => {
  return nodes.map((node) => ({ ...node })) as readonly VirtualDomNode[]
}

const toMessageInlineNode = (node: ChatViewInlineNode): MessageInlineNode => {
  switch (node.type) {
    case 'bold':
      return {
        ...node,
        children: node.children.map(toMessageInlineNode),
      }
    case 'italic':
      return {
        ...node,
        children: node.children.map(toMessageInlineNode),
      }
    case 'math-inline-dom':
      return {
        dom: toVirtualDomNodes(node.dom),
        type: 'math-inline-dom',
      }
    case 'strikethrough':
      return {
        ...node,
        children: node.children.map(toMessageInlineNode),
      }
    default:
      return node
  }
}

const toMessageListItemNode = (node: ChatViewListItemNode): MessageListItemNode => {
  return {
    ...node,
    children: node.children.map(toMessageInlineNode),
    ...(node.nestedItems
      ? {
          nestedItems: node.nestedItems.map(toMessageListItemNode),
        }
      : {}),
  }
}

const toMessageTableCellNode = (node: ChatViewTableCellNode): MessageTableCellNode => {
  return {
    ...node,
    children: node.children.map(toMessageInlineNode),
  }
}

const toMessageIntermediateNode = (node: ChatViewContentNode): MessageIntermediateNode => {
  switch (node.type) {
    case 'blockquote':
      return {
        ...node,
        children: node.children.map(toMessageIntermediateNode),
      }
    case 'heading':
    case 'text':
      return {
        ...node,
        children: node.children.map(toMessageInlineNode),
      }
    case 'math-block-dom':
      return {
        dom: toVirtualDomNodes(node.dom),
        type: 'math-block-dom',
      }
    case 'ordered-list':
    case 'unordered-list':
      return {
        ...node,
        items: node.items.map(toMessageListItemNode),
      }
    case 'table':
      return {
        ...node,
        headers: node.headers.map(toMessageTableCellNode),
        rows: node.rows.map((row) => ({
          ...row,
          cells: row.cells.map(toMessageTableCellNode),
        })),
      }
    default:
      return node
  }
}

export const toMessageIntermediateNodes = (nodes: readonly ChatViewContentNode[]): readonly MessageIntermediateNode[] => {
  return nodes.map(toMessageIntermediateNode)
}
