import type { TodoListItem } from '../TodoListItem/TodoListItem.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'

 
export const getTodoItemClassName = (status: TodoListItem['status']): string => {
  if (status === 'completed') {
    return `${ClassNames.ChatTodoListItem} ${ClassNames.ChatTodoListItemCompleted} completed`
  }
  if (status === 'inProgress') {
    return `${ClassNames.ChatTodoListItem} ${ClassNames.ChatTodoListItemInProgress} inProgress`
  }
  return `${ClassNames.ChatTodoListItem} ${ClassNames.ChatTodoListItemTodo} todo`
}
