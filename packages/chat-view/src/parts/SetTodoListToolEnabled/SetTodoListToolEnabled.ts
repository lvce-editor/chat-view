import type { ChatState } from '../ChatState/ChatState.ts'

export const setTodoListToolEnabled = (state: ChatState, todoListToolEnabled: boolean): ChatState => {
  return {
    ...state,
    todoListToolEnabled,
  }
}
