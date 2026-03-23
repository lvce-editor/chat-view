import type { TodoListItem } from '../TodoListItem/TodoListItem.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const getTodoItemClassName = (status: TodoListItem['status']): string => {
  if (status === 'completed') {
    return `${ClassNames.ChatTodoListItem} ${ClassNames.ChatTodoListItemCompleted} completed`
  }
  if (status === 'inProgress') {
    return `${ClassNames.ChatTodoListItem} ${ClassNames.ChatTodoListItemInProgress} inProgress`
  }
  return `${ClassNames.ChatTodoListItem} ${ClassNames.ChatTodoListItemTodo} todo`
}
