export type MessageIntermediateNode = MessageTextNode | MessageListNode | MessageTableNode | MessageCodeBlockNode

export type MessageInlineNode = MessageInlineTextNode | MessageInlineLinkNode | MessageInlineBoldNode

export interface MessageInlineTextNode {
  readonly text: string
  readonly type: 'text'
}

export interface MessageInlineLinkNode {
  readonly href: string
  readonly text: string
  readonly type: 'link'
}

export interface MessageInlineBoldNode {
  readonly text: string
  readonly type: 'bold'
}

export interface MessageTextNode {
  readonly children: readonly MessageInlineNode[]
  readonly type: 'text'
}

export interface MessageListNode {
  readonly items: readonly MessageListItemNode[]
  readonly type: 'list'
}

export interface MessageListItemNode {
  readonly children: readonly MessageInlineNode[]
  readonly type: 'list-item'
}

export interface MessageTableNode {
  readonly headers: readonly MessageTableCellNode[]
  readonly rows: readonly MessageTableRowNode[]
  readonly type: 'table'
}

export interface MessageTableCellNode {
  readonly children: readonly MessageInlineNode[]
  readonly type: 'table-cell'
}

export interface MessageTableRowNode {
  readonly cells: readonly MessageTableCellNode[]
  readonly type: 'table-row'
}

export interface MessageCodeBlockNode {
  readonly text: string
  readonly type: 'code-block'
}
