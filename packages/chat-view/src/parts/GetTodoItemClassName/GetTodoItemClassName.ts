import { mergeClassNames } from '@lvce-editor/virtual-dom-worker'
import type { TodoListItem } from '../TodoListItem/TodoListItem.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'

export const getTodoItemClassName = (status: TodoListItem['status']): string => {
  if (status === 'completed') {
    return mergeClassNames(ClassNames.ChatTodoListItem, ClassNames.ChatTodoListItemCompleted, 'completed')
  }
  if (status === 'inProgress') {
    return mergeClassNames(ClassNames.ChatTodoListItem, ClassNames.ChatTodoListItemInProgress, 'inProgress')
  }
  return mergeClassNames(ClassNames.ChatTodoListItem, ClassNames.ChatTodoListItemTodo, 'todo')
}
