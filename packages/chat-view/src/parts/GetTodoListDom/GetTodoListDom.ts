import { type VirtualDomNode, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { TodoListItem } from '../TodoListItem/TodoListItem.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getTodoItemClassName } from '../GetTodoItemClassName/GetTodoItemClassName.ts'

const chatTodoListNode: VirtualDomNode = {
  childCount: 2,
  className: ClassNames.ChatTodoList,
  type: VirtualDomElements.Div,
}

const chatTodoListHeaderNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.ChatTodoListHeader,
  type: VirtualDomElements.Div,
}

export const getTodoListDom = (hasTodoList: boolean, todoListItems: readonly TodoListItem[]): readonly VirtualDomNode[] => {
  if (!hasTodoList) {
    return []
  }
  const todoHeaderText = `Todos (${todoListItems.filter((item) => item.status === 'completed').length}/${todoListItems.length})`
  return [
    chatTodoListNode,
    chatTodoListHeaderNode,
    {
      ...text(todoHeaderText),
    },
    {
      childCount: todoListItems.length,
      className: ClassNames.ChatTodoListItems,
      type: VirtualDomElements.Ul,
    },
    ...todoListItems.flatMap((item) => [
      {
        childCount: 1,
        className: getTodoItemClassName(item.status),
        type: VirtualDomElements.Li,
      },
      text(item.text),
    ]),
  ]
}
