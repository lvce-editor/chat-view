import { mergeClassNames } from '@lvce-editor/virtual-dom-worker'
import type { TodoListItem } from '../TodoListItem/TodoListItem.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'

const completedClassName = mergeClassNames(ClassNames.ChatTodoListItem, ClassNames.ChatTodoListItemCompleted, 'completed')
const inProgressClassName = mergeClassNames(ClassNames.ChatTodoListItem, ClassNames.ChatTodoListItemInProgress, 'inProgress')
const todoClassName = mergeClassNames(ClassNames.ChatTodoListItem, ClassNames.ChatTodoListItemTodo, 'todo')

export const getTodoItemClassName = (status: TodoListItem['status']): string => {
  if (status === 'completed') {
    return completedClassName
  }
  if (status === 'inProgress') {
    return inProgressClassName
  }
  return todoClassName
}
