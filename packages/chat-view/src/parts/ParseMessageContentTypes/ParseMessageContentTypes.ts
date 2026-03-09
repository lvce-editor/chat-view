export type MessageIntermediateNode = MessageTextNode | MessageListNode

export interface MessageTextNode {
  readonly text: string
  readonly type: 'text'
}

export interface MessageListNode {
  readonly items: readonly MessageListItemNode[]
  readonly type: 'list'
}

export interface MessageListItemNode {
  readonly text: string
  readonly type: 'list-item'
}
