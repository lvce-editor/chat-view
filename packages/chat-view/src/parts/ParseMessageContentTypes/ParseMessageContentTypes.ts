export type MessageIntermediateNode = MessageTextNode | MessageListNode | MessageCustomUiNode | RawContentPart

export type MessageInlineNode = MessageInlineTextNode | MessageInlineLinkNode

export interface MessageInlineTextNode {
  readonly text: string
  readonly type: 'text'
}

export interface MessageInlineLinkNode {
  readonly href: string
  readonly text: string
  readonly type: 'link'
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

export interface MessageCustomUiNode {
  readonly css: string
  readonly html: string
  readonly type: 'custom-ui'
}

export interface RawContentPart {
  readonly text: string
  readonly type: 'raw-content'
}
